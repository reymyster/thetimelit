import { create } from "zustand";

import { GetAllQuotesReturnType } from "@/server/routers/admin/quotes";

type QuoteCalculatedColumns = {
  effectiveAuthor: string;
  effectiveAuthorIsProposed: boolean;
  effectiveSource: string;
  effectiveSourceIsProposed: boolean;
};

export type QuoteDisplay = GetAllQuotesReturnType[number] &
  QuoteCalculatedColumns;

export function transformQuotesForManageTableDisplay({
  quotes,
}: {
  quotes?: GetAllQuotesReturnType;
}) {
  if (!quotes) return undefined;

  return quotes.map((quote) => {
    let effectiveAuthorIsProposed = false,
      effectiveSourceIsProposed = false,
      effectiveAuthor: string = "",
      effectiveSource: string = "";

    if (quote.src) {
      effectiveSource = quote.src.title;
      effectiveAuthor = quote.src.author.name;
    } else if (quote.auth) {
      effectiveAuthor = quote.auth.name;
    }

    if (!effectiveSource && quote.proposedSource) {
      effectiveSource = quote.proposedSource;
      effectiveSourceIsProposed = true;
    }

    if (!effectiveAuthor && quote.proposedAuthor) {
      effectiveAuthor = quote.proposedAuthor;
      effectiveAuthorIsProposed = true;
    }

    return {
      ...quote,
      effectiveAuthor,
      effectiveAuthorIsProposed,
      effectiveSource,
      effectiveSourceIsProposed,
    } as QuoteDisplay;
  });
}

type State = {
  globalFilter: string;
};

type Action = {
  setGlobalFilter: (f: State["globalFilter"]) => void;
};

export const useStore = create<State & Action>((set) => ({
  globalFilter: "",
  setGlobalFilter: (f) => set(() => ({ globalFilter: f })),
}));
