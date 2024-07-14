"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Row } from "@tanstack/react-table";
import { type Quote } from "@/dbschema/interfaces";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteQuoteMutation } from "@/lib/db/admin/hooks";

interface DataTableRowActionProps {
  row: Row<Quote>;
}

export function DataTableRowActions({
  row: {
    original: { id, text },
  },
}: DataTableRowActionProps) {
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
}
