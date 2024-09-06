"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import type { GetAllQuotesReturnType } from "@/server/routers/admin/quotes";
import type { Quote } from "@/dbschema/interfaces";
import { DaysOfTheWeek } from "@/lib/dates/days-of-the-week";
import type { QuoteDisplay } from "./data";
import { cn } from "@/lib/utils";

function highlightText({
  text,
  highlight,
}: Pick<QuoteDisplay, "text" | "highlight">) {
  if (!text || !highlight) return <>{text}</>;

  const before = text.slice(0, highlight.startOffset);
  const target = text.slice(highlight.startOffset, highlight.endOffset);
  const after = text.slice(highlight.endOffset);

  return (
    <>
      {before}
      <span className="text-red-800 dark:text-red-300">{target}</span>
      {after}
    </>
  );
}

export const columns: ColumnDef<QuoteDisplay>[] = [
  {
    accessorKey: "text",
    header: "Quote",
    enableHiding: false,
    enableGlobalFilter: true,
    cell: ({
      row: {
        original: { text, highlight },
      },
    }) => {
      const quote = highlightText({ text, highlight });

      return (
        <div className="4xl:w-[960px] line-clamp-2 w-64 lg:w-[512px] 2xl:w-[720px]">
          {quote}
        </div>
      );
    },
  },
  {
    accessorKey: "day",
    header: "Day",
    enableGlobalFilter: false,
    cell: ({
      row: {
        original: { day },
      },
    }) => {
      const dayName = day !== null ? DaysOfTheWeek[day].short : "-";
      return <div>{dayName}</div>;
    },
  },
  {
    accessorKey: "effectiveAuthor",
    header: "Author",
    enableGlobalFilter: false,
    cell: ({
      row: {
        original: { effectiveAuthor, effectiveAuthorIsProposed },
      },
    }) => {
      return (
        <div
          className={cn(
            "line-clamp-1 w-24 lg:w-36 2xl:w-48",
            effectiveAuthorIsProposed && "text-primary/60",
          )}
        >
          {effectiveAuthor}
        </div>
      );
    },
  },
  {
    accessorKey: "effectiveSource",
    header: "Source",
    enableGlobalFilter: false,
    cell: ({
      row: {
        original: { effectiveSource, effectiveSourceIsProposed },
      },
    }) => {
      return (
        <div
          className={cn(
            "line-clamp-w w-24 lg:w-36 2xl:w-48",
            effectiveSourceIsProposed && "text-primary/60",
          )}
        >
          {effectiveSource}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
