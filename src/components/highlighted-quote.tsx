import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";

interface Props {
  text?: string;
  highlight?: {
    startOffset: number;
    endOffset: number;
  } | null;
  className?: ClassValue;
}

export function HighlightedQuote({ text, highlight, className }: Props) {
  if (!text || !highlight) return <>{text}</>;

  const before = text.slice(0, highlight.startOffset);
  const target = text.slice(highlight.startOffset, highlight.endOffset);
  const after = text.slice(highlight.endOffset);

  return (
    <>
      {before}
      <span className={cn("text-red-800 dark:text-red-300", className)}>
        {target}
      </span>
      {after}
    </>
  );
}
