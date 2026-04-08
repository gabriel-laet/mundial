"use client";

import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
}

export function StatCard({ label, value, suffix }: StatCardProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1200;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card p-6 shadow-sm"
    >
      <span className="text-4xl font-bold tabular-nums text-primary">
        {display.toLocaleString()}
        {suffix && (
          <span className="text-2xl text-muted-foreground ml-0.5">
            {suffix}
          </span>
        )}
      </span>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
