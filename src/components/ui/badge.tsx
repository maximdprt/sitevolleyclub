import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-[#f0f7ff]/10 bg-[#f0f7ff]/5 text-[#f0f7ff]/80",
        accent: "border-[#e8610a]/25 bg-[#e8610a]/10 text-[#ff7a28]",
        success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        warning: "border-amber-500/25 bg-amber-500/10 text-amber-400",
        destructive: "border-red-500/25 bg-red-500/10 text-red-400",
        ocean: "border-[#2b7fbf]/25 bg-[#2b7fbf]/10 text-[#2b7fbf]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
