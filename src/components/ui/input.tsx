import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border bg-[#1a3a5c]/60 px-4 py-2 text-sm text-[#f0f7ff]",
          "border-[#f0f7ff]/10 placeholder:text-[#f0f7ff]/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b7fbf] focus-visible:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-150",
          error && "border-red-500/50 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
