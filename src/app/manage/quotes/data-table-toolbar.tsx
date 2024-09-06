"use client";

import { useCallback } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

import { useStore, daysForFiltering } from "./data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const globalFilter = useStore((state) => state.globalFilter);
  const setGlobalFilter = useStore((state) => state.setGlobalFilter);

  const areFiltersChanged =
    Boolean(globalFilter) || (table.getState().columnFilters?.length ?? 0) > 0;
  const resetFilters = useCallback(() => {
    if (globalFilter) setGlobalFilter("");
    table.resetColumnFilters();
  }, [globalFilter, setGlobalFilter, table]);

  return (
    <div className="4xl:gap-32 z-50 flex items-center justify-between gap-4 lg:gap-16">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search quote text..."
          className="h-8 w-[150px] lg:w-[250px]"
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
        />
        {table.getColumn("day") && (
          <DataTableFacetedFilter
            column={table.getColumn("day")}
            title="Day"
            options={daysForFiltering}
          />
        )}
        {areFiltersChanged && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-8 px-2 lg:px-3"
          >
            <XCircleIcon className="mr-2 size-4" /> Reset
          </Button>
        )}
      </div>
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
