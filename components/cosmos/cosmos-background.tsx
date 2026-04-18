"use client";
// components/cosmos/cosmos-background.tsx
// The living star field with parallax and mouse gravity.
// Renders behind all dashboard content via CSS z-index.

import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  color: string;
}

interface Mouse {
  x: number;
  y: number;
}

const STAR_COLORS = ["#F0EDE8", "#F0EDE8", "#F0EDE8", "#C9922A", "#26D9D9"];
const STAR_COUNT = 180;

function createStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * 2000,
    y: Math.random() * 1200,
    r: Math.random() * 1.2 + 0.2,
    speed: Math.random() * 0.08 + 0.02,
    opacity: Math.random() * 0.5 + 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.02 + 0.005,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  }));
}

export function CosmosBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>(createStars());
  const mouseRef = useRef<Mouse>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;

    function resize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Deep space background
      const bg = ctx!.createRadialGradient(W * 0.3, H * 0.3, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.9);
      bg.addColorStop(0, "rgba(13,22,40,0.98)");
      bg.addColorStop(0.5, "rgba(8,14,28,0.99)");
      bg.addColorStop(1, "rgba(5,8,15,1)");
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, W, H);

      // Gold nebula following mouse
      const nebula = ctx!.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 280
      );
      nebula.addColorStop(0, "rgba(201,146,42,0.05)");
      nebula.addColorStop(0.5, "rgba(201,146,42,0.01)");
      nebula.addColorStop(1, "transparent");
      ctx!.fillStyle = nebula;
      ctx!.fillRect(0, 0, W, H);

      // Ambient nebula clusters
      [[W * 0.15, H * 0.2, "rgba(38,217,217,0.03)"], [W * 0.8, H * 0.7, "rgba(155,143,255,0.025)"]].forEach(([x, y, c]) => {
        const g = ctx!.createRadialGradient(x as number, y as number, 0, x as number, y as number, 200);
        g.addColorStop(0, c as string);
        g.addColorStop(1, "transparent");
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, W, H);
      });

      // Stars with parallax
      starsRef.current.forEach((s) => {
        s.pulse += s.pulseSpeed;
        const pulsed = s.opacity + Math.sin(s.pulse) * 0.15;
        const dx = (mouseRef.current.x - W / 2) * s.speed * 0.05;
        const dy = (mouseRef.current.y - H / 2) * s.speed * 0.05;
        const px = ((s.x - dx) % W + W) % W;
        const py = ((s.y - dy) % H + H) % H;

        ctx!.save();
        ctx!.globalAlpha = Math.max(0, Math.min(1, pulsed));
        ctx!.fillStyle = s.color;
        if (s.r > 0.9) {
          ctx!.shadowColor = s.color;
          ctx!.shadowBlur = 4;
        }
        ctx!.beginPath();
        ctx!.arc(px, py, s.r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
