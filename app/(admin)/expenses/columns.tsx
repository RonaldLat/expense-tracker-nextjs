"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  notes?: string | null;
  date: string; // ISO
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
};

type Category = { id: string; name: string };

export function columns(
  _categories: Category[],
  _onUpdate: (id: string, field: string, value: any) => void,
  onDelete: (id: string) => void,
): ColumnDef<Expense>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span>{row.getValue("title") as string}</span>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const value = row.getValue("amount") as number;
        return <span className="font-medium">{value.toFixed(2)}</span>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      accessorFn: (row) => row.category?.name ?? "None",
      cell: ({ row }) => <span>{row.original.category?.name ?? "None"}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const value = row.getValue("date") as string;
        return <span>{new Date(value).toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <span>{(row.getValue("notes") as string) || "-"}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex items-center gap-2">
            {/* Future: open edit modal */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert(`Edit expense ${id}`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}

// export both ways for flexibility
export const columnsFactory = columns;
export { columns as createColumns };
