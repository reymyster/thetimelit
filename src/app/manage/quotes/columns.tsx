"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type Quote } from "@/dbschema/interfaces";

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "text",
    header: "Text",
    cell: ({ row }) => {
      const text = row.getValue<string>("text");

      return <div className="max-w-lg truncate">{text}</div>;
    },
  },
];
