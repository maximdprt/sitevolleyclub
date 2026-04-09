import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-20 w-full rounded-xl border border-[#f0f7ff]/10 bg-[#1a3a5c]/60 px-4 py-3 text-sm text-[#f0f7ff]",
        "placeholder:text-[#f0f7ff]/30 resize-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b7fbf] focus-visible:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-150",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
