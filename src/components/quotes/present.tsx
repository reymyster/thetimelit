import { type Quote, type Src, type Author } from "@/dbschema/interfaces";

interface QuotePresentation {
  text: Quote["text"];
  highlight?: Quote["highlight"];
  src?: {
    title: Src["title"];
    author: {
      name: Author["name"];
    };
  } | null;
  auth?: {
    name: Author["name"];
  } | null;
  proposedAuthor?: Quote["proposedAuthor"];
  proposedSource?: Quote["proposedSource"];
}

export function PresentQuote({ quote }: { quote: QuotePresentation }) {
  return (
    <blockquote className="text-balance text-2xl lg:text-4xl">
      <p>
        <HighlightedText quote={quote} />
      </p>
    </blockquote>
  );
}

function HighlightedText({ quote }: { quote: QuotePresentation }) {
  if (!quote.highlight) return <>{quote.text}</>;

  const {
    text,
    highlight: { startOffset, endOffset },
  } = quote;

  const before = text.slice(0, startOffset);
  const target = text.slice(startOffset, endOffset);
  const after = text.slice(endOffset);

  return (
    <>
      {before}
      <span className="font-bold">{target}</span>
      {after}
    </>
  );
}

function QSource({ quote }: { quote: QuotePresentation }) {
  let title: string | null | undefined;
  let author: string | null | undefined;

  if (quote.src) {
    title = quote.src.title;
    author = quote.src.author.name;
  } else if (quote.auth) {
    author = quote.auth.name;
  } else {
    title = quote.proposedSource;
    author = quote.proposedAuthor;
  }

  if (title || author) {
    return (
      <footer className="mt-4 text-lg">
        {title && <cite>{title}</cite>}
        {author && <> by {author}</>}
      </footer>
    );
  }

  return null;
}
