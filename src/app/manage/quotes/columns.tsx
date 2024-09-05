"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import type { GetAllQuotesReturnType } from "@/server/routers/admin/quotes";
import type { Quote } from "@/dbschema/interfaces";
import { DaysOfTheWeek } from "@/lib/dates/days-of-the-week";

function highlightText({ text, highlight }: Pick<Quote, "text" | "highlight">) {
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

export const columns: ColumnDef<GetAllQuotesReturnType[number]>[] = [
  {
    accessorKey: "text",
    header: "Quote",
    enableHiding: false,
    cell: ({
      row: {
        original: { text, highlight },
      },
    }) => {
      const quote = highlightText({ text, highlight });

      return <div className="line-clamp-2 w-64 lg:w-[512px]">{quote}</div>;
    },
  },
  {
    accessorKey: "day",
    header: "Day",
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
