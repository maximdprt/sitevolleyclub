"use client";

import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0f2d4a] group-[.toaster]:text-[#f0f7ff] group-[.toaster]:border-[#f0f7ff]/10 group-[.toaster]:shadow-xl group-[.toaster]:shadow-black/30",
          description: "group-[.toast]:text-[#f0f7ff]/50",
          actionButton: "group-[.toast]:bg-[#e8610a] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-[#1a3a5c] group-[.toast]:text-[#f0f7ff]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
