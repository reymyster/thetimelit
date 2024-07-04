"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type Quote } from "@/dbschema/interfaces";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Quote>[] = [
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
