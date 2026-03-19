"use client";

export function WaveDivider({ color = "var(--sand-light)", flipY = false }: { color?: string; flipY?: boolean }) {
  return (
    <div aria-hidden="true" className={flipY ? "transform-[scaleY(-1)]" : undefined}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="block h-12 w-full md:h-16">
        <path
          d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          fill={color}
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z;
                    M0,40 C360,0 1080,80 1440,40 L1440,80 L0,80 Z;
                    M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          />
        </path>
      </svg>
    </div>
  );
}

