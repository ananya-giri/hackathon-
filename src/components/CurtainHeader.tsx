"use client";

import React from "react";

interface CurtainHeaderProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "div" | "span";
  className?: string;
  curtainClassName?: string;
  startIndex?: number;
}

export default function CurtainHeader({
  text,
  as: Component = "h2",
  className = "",
  curtainClassName = "",
  startIndex = 0,
}: CurtainHeaderProps) {
  // Split into words so that word-wrapping works naturally on mobile/tablet screens
  const words = text.trim().split(/\s+/);
  let currentIndex = startIndex;

  // If a single word and Component is div, render the exact single markup directly
  if (words.length === 1 && Component === "div") {
    const chars = Array.from(words[0]);
    return (
      <div
        className={`fx-curtain ${curtainClassName} ${className}`.trim()}
        role="img"
        aria-label={words[0]}
      >
        {chars.map((char, charIdx) => (
          <b
            key={charIdx}
            aria-hidden="true"
            style={{ "--i": startIndex + charIdx } as React.CSSProperties}
          >
            {char}
          </b>
        ))}
      </div>
    );
  }

  return (
    <Component
      className={`inline-flex flex-wrap items-center justify-center gap-x-[0.32em] gap-y-1 ${className}`.trim()}
    >
      {words.map((word, wordIdx) => {
        const chars = Array.from(word);
        const wordStart = currentIndex;
        currentIndex += chars.length;

        return (
          <div
            key={wordIdx}
            className={`fx-curtain ${curtainClassName}`.trim()}
            role="img"
            aria-label={word}
          >
            {chars.map((char, charIdx) => {
              const i = wordStart + charIdx;
              return (
                <b
                  key={charIdx}
                  aria-hidden="true"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {char}
                </b>
              );
            })}
          </div>
        );
      })}
    </Component>
  );
}
