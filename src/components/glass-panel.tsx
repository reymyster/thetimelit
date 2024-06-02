import * as React from "react";
import { cn } from "@/lib/utils";

export function GlassPanel({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "mx-8 rounded-3xl border border-background/50 bg-background/50 p-12 text-foreground/80 shadow-xl backdrop-blur-sm lg:max-w-4xl lg:p-24",
        className,
      )}
    >
      {children}
    </div>
  );
}
