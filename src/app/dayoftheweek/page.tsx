import { createClient } from "edgedb";
import e from "@/dbschema/edgeql-js";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const client = createClient();

export default async function DayOfTheWeekPage() {
  const today = new Date().getDay();

  const selectedQuotes = e.select(e.Quote, (quote) => {
    const isToday = e.op(quote.day, "=", today);
    const hasHighlight = e.op("exists", quote.highlight);
    return {
      text: true,
      highlight: true,
      src: {
        title: true,
        author: {
          name: true,
        },
      },
      filter: e.op(isToday, "and", hasHighlight),
      order_by: [{ expression: e.random() }],
      limit: 1,
    };
  });

  const quote = (await selectedQuotes.run(client))?.[0];

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
            On the <span className="font-bold">Monday</span> morning, so far as
            I can tell it, nothing happened to disturb the customary quiet of
            the house.
          </p>
          <footer className="mt-4 text-lg">
            <cite>&quot;The Moonstone&quot;</cite> by Wilkie Collins
          </footer>
        </blockquote>
        {quote && (
          <blockquote className="text-balance text-2xl lg:text-4xl">
            <p>
              {quote.highlight
                ? injectSpan(
                    quote.text,
                    quote.highlight.start,
                    quote.highlight.end,
                  )
                : quote.text}
            </p>
            {quote.src && (
              <footer className="mt-4 text-lg">
                <cite>{quote.src.title}</cite>
                {quote.src.author && <> by {quote.src.author.name}</>}
              </footer>
            )}
          </blockquote>
        )}
      </div>
    </main>
  );
}

function injectSpan(str: string, start: number, end: number) {
  if (start < 0 || end > str.length || start >= end) {
    throw new Error("Invalid start or end index.");
  }

  const before = str.slice(0, start);
  const target = str.slice(start, end);
  const after = str.slice(end);

  return (
    <>
      {before}
      <span className="font-bold">{target}</span>
      {after}
    </>
  );
}
