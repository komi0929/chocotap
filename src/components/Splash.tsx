"use client";

import { useEffect, useState } from "react";
import { ChocolateIcon } from "./Icons";

export default function Splash({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onDone, 300);
          return 100;
        }
        return p + 4;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] bg-pastel flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="mx-auto mb-6 w-16 h-16 animate-float">
          <ChocolateIcon className="w-full h-full" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl font-semibold text-choco tracking-widest">
          chocotap
        </h1>
        <p className="text-sm text-text-dim mt-1 tracking-wider">
          craft chocolate stamp rally
        </p>

        {/* Loader */}
        <div className="mt-8 w-40 mx-auto h-0.5 bg-cream-deep rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-choco-milk to-accent rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
