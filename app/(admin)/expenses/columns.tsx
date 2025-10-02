"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";
import type { Expense } from "./page";

type Category = { id: string; name: string };

export function columns(
  _categories: Category[],
  onUpdate: (id: string, field: string, value: any) => void,
  onDelete: (id: string) => void
): ColumnDef<Expense>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => row.original.amount.toFixed(2),
    },
    {
      id: "category",
      header: "Category",
      accessorFn: (row) => row.category?.name ?? "None",
      cell: ({ row }) => row.original.category?.name ?? "None",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        row.original.date
          ? new Date(row.original.date).toLocaleDateString()
          : "",
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => row.original.notes ?? "",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex items-center gap-2">
            {/* Edit button (you can later hook this to open a modal/form) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Example: open modal or form
                console.log("Edit clicked for", id);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            {/* Delete button */}
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

// export both ways for consistency
export const columnsFactory = columns;
export { columns as createColumns };
