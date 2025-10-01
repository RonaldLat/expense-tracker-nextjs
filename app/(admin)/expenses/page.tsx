"use client";

import * as React from "react";
import { DataTable } from "./data-table";
import { columns as createColumns, Expense } from "./columns";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

export type Category = { id: string; name: string };

export default function ExpensesPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  // TanStack state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [expensesRes, categoriesRes] = await Promise.all([
          fetch("/api/expenses"),
          fetch("/api/categories"),
        ]);
        const expensesData: Expense[] = await expensesRes.json();
        const categoriesData: Category[] = await categoriesRes.json();
        setExpenses(expensesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdate = async (id: string, field: string, value: any) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
    try {
      await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <DataTable
        data={expenses}
        columns={createColumns(categories, handleUpdate, handleDelete)}
        sorting={sorting}
        onSortingChange={setSorting}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </div>
  );
}
