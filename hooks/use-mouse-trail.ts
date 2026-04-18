"use client";
// hooks/use-mouse-trail.ts
// Creates a subtle gold glow trail that follows the cursor.
// Call once at the layout level — keeps DOM clean via auto-cleanup.

import { useEffect } from "react";

export function useMouseTrail() {
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (Math.random() > 0.82) {
        const dot = document.createElement("div");
        dot.style.cssText = `
          position:fixed;
          left:${e.clientX}px;
          top:${e.clientY}px;
          width:4px;height:4px;
          border-radius:50%;
          background:#F0B83C;
          box-shadow:0 0 6px #C9922A;
          pointer-events:none;
          z-index:9999;
          transform:translate(-50%,-50%);
          animation:trailFade 0.8s ease-out forwards;
        `;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 800);
      }
    }

    // Inject keyframe if not already present
    if (!document.getElementById("trail-keyframe")) {
      const style = document.createElement("style");
      style.id = "trail-keyframe";
      style.textContent = `
        @keyframes trailFade {
          from { transform: translate(-50%,-50%) scale(1.2); opacity: 0.8; }
          to   { transform: translate(-50%,-50%) scale(0);   opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
}
