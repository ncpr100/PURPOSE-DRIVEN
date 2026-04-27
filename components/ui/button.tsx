// components/ui/button.tsx
// COSMOS REDESIGN ΓÇö updated for Cosmos token system
// Adds btn-cta-gradient utility, removes hardcoded blue gradients (P1-B fix)

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-md",
    "text-sm font-medium",
    "ring-offset-background",
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // ΓöÇ Primary ΓÇö gold ΓöÇ
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-gold active:scale-[0.98]",

        // ΓöÇ CTA gradient (replaces from-blue-500 to-purple-600 P1-B fix) ΓöÇ
        cta:
          "btn-cta-gradient rounded-md",

        // ΓöÇ Destructive ΓöÇ
        destructive:
          "bg-destructive/12 text-destructive border border-destructive/25 hover:bg-destructive/20 hover:border-destructive/40",

        // ΓöÇ Outline ΓöÇ
        outline:
          "border border-[rgba(201,146,42,0.2)] bg-transparent text-foreground hover:bg-accent/40 hover:border-[rgba(201,146,42,0.4)]",

        // ΓöÇ Secondary ΓöÇ
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // ΓöÇ Ghost ΓöÇ
        ghost:
          "bg-transparent text-muted-foreground hover:bg-accent/40 hover:text-accent-foreground",

        // ΓöÇ Link ΓöÇ
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",

        // ΓöÇ Cosmos variants ΓöÇ
        emerald:
          "bg-[rgba(29,201,140,0.12)] text-[#1DC98C] border border-[rgba(29,201,140,0.25)] hover:bg-[rgba(29,201,140,0.2)] hover:border-[rgba(29,201,140,0.5)]",
        gold:
          "bg-[hsl(var(--brand-gold)/0.12)] text-gold-bright border border-[hsl(var(--brand-gold)/0.25)] hover:bg-[hsl(var(--brand-gold)/0.2)] hover:border-[hsl(var(--brand-gold)/0.5)]",
        rose:
          "bg-[rgba(232,72,85,0.12)] text-[#E84855] border border-[rgba(232,72,85,0.25)] hover:bg-[rgba(232,72,85,0.2)]",
        cyan:
          "bg-[rgba(38,217,217,0.12)] text-[#26D9D9] border border-[rgba(38,217,217,0.25)] hover:bg-[rgba(38,217,217,0.2)]",

        // ΓöÇ Glass ΓöÇ
        glass:
          "bg-[rgba(255,255,255,0.05)] text-foreground border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] backdrop-blur-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm:      "h-8 px-3 py-1.5 text-xs rounded-md",
        lg:      "h-11 px-8 py-2.5",
        xl:      "h-12 px-10 py-3 text-base",
        icon:    "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span
              className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin"
              aria-hidden
            />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
