"use client";

import { trpc } from "@/app/_trpc/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { GlassPanel } from "@/components/glass-panel";

export default function ManageQuotes() {
  const { status, data: quotes } = trpc.admin.quotes.getAll.useQuery();

  if (status === "pending") return <div>Loading...</div>;

  if (typeof quotes === "undefined") return <div>Error loading quotes</div>;

  return (
    <main className="flex flex-grow flex-col items-center justify-center">
      <DataTable columns={columns} data={quotes} />
    </main>
  );
}
