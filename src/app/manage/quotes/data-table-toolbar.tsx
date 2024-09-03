"use client";

import { PlusIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="z-50 flex items-center justify-between">
      <div>&nbsp;</div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto flex h-8 bg-background/80"
          asChild
        >
          <Link href="/manage/quote/new" prefetch={false}>
            <PlusIcon className="mr-2 size-4" />
            New
          </Link>
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
