"use client";

import { trpc } from "@/app/_trpc/client";
import { useDateResetsEvery } from "@/lib/dates/hooks";
import { cn } from "@/lib/utils";
import { PresentQuote } from "@/components/quotes/present";

export default function DayOfTheWeekPage() {
  const today = useDateResetsEvery("hour");
  const day = today.getDay();
  const { status, data: quote } = trpc.public.quotes.getForDay.useQuery(day);

  if (status === "pending") return <div>Loading...</div>;

  return (
    <main className="flex flex-grow flex-col items-center justify-center">
      <div className="mx-8 rounded-3xl border border-background/50 bg-background/50 p-12 text-foreground/80 shadow-xl backdrop-blur-sm lg:max-w-4xl lg:p-24">
        <blockquote
          className={cn(
            "text-balance text-2xl lg:text-4xl",
            quote ? "hidden" : "",
          )}
        >
          <p>
            On the{" "}
            <span className="font-bold text-yellow-700 dark:text-yellow-400">
              Monday
            </span>{" "}
            morning, so far as I can tell it, nothing happened to disturb the
            customary quiet of the house.
          </p>
          <footer className="mt-4 text-lg">
            <cite>&quot;The Moonstone&quot;</cite> by Wilkie Collins
          </footer>
        </blockquote>
        {quote && <PresentQuote quote={quote} />}
      </div>
    </main>
  );
}
