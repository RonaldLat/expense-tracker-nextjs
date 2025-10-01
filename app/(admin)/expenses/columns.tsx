"use client";

import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Expense, Category } from "./page";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export const columns = (
  categories: Category[],
  handleUpdate: (id: string, field: string, value: any) => void,
  handleDelete: (id: string) => void,
): ColumnDef<Expense>[] => [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.getValue("description"),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `Ksh. ${row.getValue("amount")}`,
  },

  {
    accessorFn: (row) => row.category.name,
    id: "category",
    header: "Category",
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    cell: ({ row }) => {
      const category = categories.find(
        (c) => c.id === row.getValue("categoryId"),
      );
      return category?.name || "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const expense = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleDelete(expense.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
