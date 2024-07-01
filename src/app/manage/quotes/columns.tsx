"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { type Quote } from "@/dbschema/interfaces";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteQuoteMutation } from "@/lib/db/admin/hooks";
import { useToast } from "@/components/ui/use-toast";

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "text",
    header: "Text",
    cell: ({ row }) => {
      const text = row.getValue<string>("text");

      return <div className="max-w-lg truncate">{text}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const deleter = useDeleteQuoteMutation();
      const { toast } = useToast();

      const confirmDelete = async () => {
        if (confirm("Really delete this quote?")) {
          await deleter.mutateAsync(id);
          toast({
            variant: "destructive",
            title: "Quote deleted",
            description: "This quote has been deleted.",
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/manage/quote/edit/${id}`} prefetch={false}>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={confirmDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
