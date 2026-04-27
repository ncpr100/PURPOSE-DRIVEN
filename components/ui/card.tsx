// components/ui/card.tsx ΓÇö Cosmos Design System

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        // ΓöÇ Default cosmos card ΓöÇ
        default: [
          "rounded-xl border border-[rgba(201,146,42,0.12)]",
          "bg-[rgba(13,22,40,0.72)] backdrop-blur-cosmos",
          "before:absolute before:inset-x-0 before:top-0 before:h-px",
          "before:bg-gradient-to-r before:from-transparent before:via-[rgba(201,146,42,0.35)] before:to-transparent",
          "hover:border-[rgba(201,146,42,0.22)] hover:-translate-y-px",
        ].join(" "),

        // ΓöÇ Glass panel ΓöÇ
        glass: [
          "rounded-xl border border-[rgba(255,255,255,0.06)]",
          "bg-[rgba(5,8,15,0.65)] backdrop-blur-cosmos",
        ].join(" "),

        // ΓöÇ Elevated ΓöÇ
        elevated: [
          "rounded-xl border border-[rgba(201,146,42,0.2)]",
          "bg-[rgba(13,22,40,0.85)] backdrop-blur-cosmos",
          "shadow-cosmos",
        ].join(" "),

        // ΓöÇ Alert ΓöÇ
        alert: [
          "rounded-xl border border-[rgba(232,72,85,0.3)]",
          "bg-[rgba(232,72,85,0.06)] backdrop-blur-sm",
        ].join(" "),

        // ΓöÇ Success ΓöÇ
        success: [
          "rounded-xl border border-[rgba(29,201,140,0.25)]",
          "bg-[rgba(29,201,140,0.06)] backdrop-blur-sm",
        ].join(" "),

        // ΓöÇ Flat (no blur, for performance in lists) ΓöÇ
        flat: [
          "rounded-lg border border-[rgba(255,255,255,0.06)]",
          "bg-[rgba(13,22,40,0.5)]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-5 pb-3", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-sm font-semibold text-foreground leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
