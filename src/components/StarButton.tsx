"use client";

import React, { useState } from "react";

const Star = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 784.11 815.53"
    className="w-full h-auto fill-[#fec195] dark:fill-[#fffdef]"
  >
    <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
  </svg>
);

type StarButtonProps = {
  href?: string;
  target?: string;
  rel?: string;
  download?: string;
  as?: "button" | "a";
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function StarButton({
  children,
  className = "",
  href,
  target,
  rel,
  download,
  as: Component = href ? "a" : "button",
  onClick,
  ...props
}: StarButtonProps) {
  const [isSparkling, setIsSparkling] = useState(false);

  const handleClick = (e: React.MouseEvent<any>) => {
    setIsSparkling(false);
    requestAnimationFrame(() => {
      setIsSparkling(true);
    });
    setTimeout(() => {
      setIsSparkling(false);
    }, 850);

    if (onClick) {
      onClick(e);
    }
  };

  const baseClasses = `
    group relative 
    inline-flex items-center justify-center gap-2
    px-[24px] py-[10px] sm:px-[32px] sm:py-[12px] 
    text-[13px] sm:text-[15px] font-bold font-mono tracking-wide
    text-[#181818] 
    bg-[#fec195] 
    border-[2px] border-[#fec195] 
    rounded-xl 
    shadow-[0_4px_14px_rgba(255,186,0,0.18)] 
    [--tw-shadow-color:#fec195]
    transition-all duration-300 ease-out 
    cursor-pointer select-none
    hover:bg-transparent hover:text-[#fec195] hover:shadow-[0_0_20px_#fec19566]
    active:scale-95
  `;

  const starElements = (
    <>
      {/* Star 1 - Top Left */}
      <div
        className={`
          absolute pointer-events-none transition-all duration-500 ease-out
          w-[22px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          ${
            isSparkling
              ? "anim-star-burst-1 z-20"
              : "opacity-0 scale-0 group-hover:opacity-85 group-hover:scale-100 group-hover:top-[-45%] group-hover:left-[-15%] z-10"
          }
        `}
      >
        <Star />
      </div>

      {/* Star 2 - Top Right */}
      <div
        className={`
          absolute pointer-events-none transition-all duration-500 ease-out
          w-[16px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          ${
            isSparkling
              ? "anim-star-burst-2 z-20"
              : "opacity-0 scale-0 group-hover:opacity-85 group-hover:scale-100 group-hover:top-[-45%] group-hover:left-[105%] z-10"
          }
        `}
      >
        <Star />
      </div>

      {/* Star 3 - Bottom Left */}
      <div
        className={`
          absolute pointer-events-none transition-all duration-500 ease-out
          w-[12px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          ${
            isSparkling
              ? "anim-star-burst-3 z-20"
              : "opacity-0 scale-0 group-hover:opacity-80 group-hover:scale-90 group-hover:top-[125%] group-hover:left-[-10%] z-10"
          }
        `}
      >
        <Star />
      </div>

      {/* Star 4 - Bottom Right */}
      <div
        className={`
          absolute pointer-events-none transition-all duration-500 ease-out
          w-[14px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          ${
            isSparkling
              ? "anim-star-burst-4 z-20"
              : "opacity-0 scale-0 group-hover:opacity-80 group-hover:scale-90 group-hover:top-[120%] group-hover:left-[100%] z-10"
          }
        `}
      >
        <Star />
      </div>

      {/* Star 5 - Top Center */}
      <div
        className={`
          absolute pointer-events-none transition-all duration-500 ease-out
          w-[18px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          ${
            isSparkling
              ? "anim-star-burst-5 z-20"
              : "opacity-0 scale-0 group-hover:opacity-90 group-hover:scale-100 group-hover:top-[-55%] group-hover:left-[50%] z-10"
          }
        `}
      >
        <Star />
      </div>

      {/* Star 6 - Bottom Center */}
      <div
        className={`
          absolute pointer-events-none transition-all duration-500 ease-out
          w-[10px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          ${
            isSparkling
              ? "anim-star-burst-6 z-20"
              : "opacity-0 scale-0 group-hover:opacity-75 group-hover:scale-90 group-hover:top-[130%] group-hover:left-[45%] z-10"
          }
        `}
      >
        <Star />
      </div>
    </>
  );

  if (Component === "a" || href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        download={download}
        onClick={handleClick}
        className={`${baseClasses} ${className}`.trim()}
        {...(props as any)}
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2 select-none">
          {children}
        </span>
        {starElements}
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${className}`.trim()}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2 select-none">
        {children}
      </span>
      {starElements}
    </button>
  );
}
