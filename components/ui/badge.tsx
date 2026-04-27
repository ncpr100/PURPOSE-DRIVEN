// components/ui/badge.tsx
// COSMOS REDESIGN ΓÇö fixes P1-A: success/warning were hardcoded bg-green-500/bg-yellow-500
// All variants now use CSS custom property tokens

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  // Base styles
  [
    "inline-flex items-center gap-1",
    "rounded-full px-2 py-0.5",
    "text-[10px] font-medium",
    "border",
    "transition-colors duration-150",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // ΓöÇ Core shadcn/ui variants (token-based) ΓöÇ
        default:
          "bg-primary/15 text-primary border-primary/30 hover:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80",
        destructive:
          "bg-destructive/12 text-destructive border-destructive/25 hover:bg-destructive/18",
        outline:
          "border-border text-foreground bg-transparent hover:bg-accent/30",

        // ΓöÇ Semantic status variants (FIXED P1-A) ΓöÇ
        success:
          "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.25)] hover:bg-[hsl(var(--success)/0.18)]",
        warning:
          "bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.25)] hover:bg-[hsl(var(--warning)/0.18)]",
        info:
          "bg-[hsl(var(--info)/0.12)] text-[hsl(var(--info))] border-[hsl(var(--info)/0.25)] hover:bg-[hsl(var(--info)/0.18)]",

        // ΓöÇ Follow-up status variants (replaces STATUS_COLORS map in visitor-followups-client.tsx P1-C) ΓöÇ
        pending:
          "bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.25)]",
        completed:
          "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.25)]",
        scheduled:
          "bg-[hsl(var(--info)/0.12)] text-[hsl(var(--info))] border-[hsl(var(--info)/0.25)]",
        skipped:
          "bg-[rgba(138,147,168,0.1)] text-[rgba(138,147,168,0.8)] border-[rgba(138,147,168,0.2)]",

        // ΓöÇ Priority variants (replaces PRIORITY_COLORS map P1-C) ΓöÇ
        "priority-high":
          "bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.25)]",
        "priority-medium":
          "bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.25)]",
        "priority-low":
          "bg-[rgba(138,147,168,0.08)] text-[rgba(138,147,168,0.6)] border-transparent",

        // ΓöÇ Cosmos brand variants ΓöÇ
        gold:
          "bg-[hsl(var(--brand-gold)/0.15)] text-[hsl(var(--brand-gold-bright))] border-[hsl(var(--brand-gold)/0.3)]",
        cosmos:
          "bg-[rgba(29,201,140,0.12)] text-[#1DC98C] border-[rgba(29,201,140,0.25)]",

        // ΓöÇ Lifecycle stage variants (for member badges) ΓöÇ
        visitante:
          "bg-[rgba(148,163,184,0.12)] text-[rgba(148,163,184,0.9)] border-[rgba(148,163,184,0.2)]",
        "nuevo-creyente":
          "bg-[hsl(var(--info)/0.12)] text-[hsl(var(--info))] border-[hsl(var(--info)/0.25)]",
        crecimiento:
          "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.25)]",
        maduro:
          "bg-[hsl(var(--brand-gold)/0.15)] text-[hsl(var(--brand-gold-bright))] border-[hsl(var(--brand-gold)/0.3)]",
        lider:
          "bg-[rgba(155,143,255,0.15)] text-[#9B8FFF] border-[rgba(155,143,255,0.3)]",

        // ΓöÇ Coverage status variants (Agent 12) ΓöÇ
        confirmed:
          "bg-[rgba(29,201,140,0.12)] text-[#1DC98C] border-[rgba(29,201,140,0.25)]",
        covered:
          "bg-[rgba(38,217,217,0.12)] text-[#26D9D9] border-[rgba(38,217,217,0.25)]",
        cancelled:
          "bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.25)]",
        unprotected:
          "bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.25)]",
      },
      size: {
        default: "px-2 py-0.5 text-[10px]",
        sm:      "px-1.5 py-0 text-[9px]",
        lg:      "px-3 py-1 text-xs",
        xl:      "px-3.5 py-1.5 text-xs",
      },
      dot: {
        true:  "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      dot: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotAnimate?: boolean;
}

function Badge({ className, variant, size, dot, dotAnimate, children, ...props }: BadgeProps) {
  const dotColor = getDotColor(variant);

  return (
    <div className={cn(badgeVariants({ variant, size, dot }), className)} {...props}>
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: dotColor,
            animation: dotAnimate ? `livePulse 1.4s ease-in-out infinite` : undefined,
          }}
        />
      )}
      {children}
    </div>
  );
}

function getDotColor(variant: BadgeProps["variant"]): string {
  const map: Record<string, string> = {
    success:     "hsl(var(--success))",
    warning:     "hsl(var(--warning))",
    info:        "hsl(var(--info))",
    destructive: "hsl(var(--destructive))",
    completed:   "hsl(var(--success))",
    pending:     "hsl(var(--warning))",
    confirmed:   "#1DC98C",
    covered:     "#26D9D9",
    cancelled:   "hsl(var(--warning))",
    unprotected: "hsl(var(--destructive))",
    gold:        "hsl(var(--brand-gold-bright))",
  };
  return map[variant as string] ?? "hsl(var(--muted-foreground))";
}

export { Badge, badgeVariants };
