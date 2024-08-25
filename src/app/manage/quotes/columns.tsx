"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { type GetAllQuotesReturnType } from "@/server/routers/admin/quotes";

export const columns: ColumnDef<GetAllQuotesReturnType[number]>[] = [
  {
    accessorKey: "text",
    header: "Text",
    cell: ({
      row: {
        original: { text },
      },
    }) => {
      return <div className="max-w-lg truncate">{text}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
