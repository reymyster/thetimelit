"use client";

import { useMemo } from "react";
import { trpc } from "@/app/_trpc/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { transformQuotesForManageTableDisplay } from "./data";

export default function ManageQuotes() {
  const { status, data: quotes } = trpc.admin.quotes.getAll.useQuery();

  const displayData = useMemo(
    () => transformQuotesForManageTableDisplay({ quotes }),
    [quotes],
  );

  if (status === "pending") return <div>Loading...</div>;

  if (typeof displayData === "undefined")
    return <div>Error loading quotes</div>;

  return (
    <main className="flex flex-grow flex-col items-center justify-start">
      <DataTable columns={columns} data={displayData} />
    </main>
  );
}
