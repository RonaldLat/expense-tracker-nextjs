"use client";

import * as React from "react";
import { DataTable } from "./data-table.tsx";
import { columnsFactory } from "./columns";
import { ExpenseForm } from "./ExpenseForm";

export type Category = { id: string; name: string };
export type Expense = {
  id: string;
  title: string;
  amount: number;
  notes?: string | null;
  date: string;
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  // fetch data on mount
  React.useEffect(() => {
    (async () => {
      const [expRes, catRes] = await Promise.all([
        fetch("/api/expenses").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]);
      setExpenses(expRes);
      setCategories(catRes);
    })();
  }, []);

  // handle add
  const handleExpenseAdded = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  // handle update
  const handleUpdate = async (id: string, field: string, value: any) => {
    await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  // handle delete
  const handleDelete = async (id: string) => {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* ✅ Form stays at top */}
      <ExpenseForm categories={categories} onExpenseAdded={handleExpenseAdded} />

      {/* ✅ Table below */}
      <DataTable
        columns={columnsFactory(categories, handleUpdate, handleDelete)}
        data={expenses}
      />
    </div>
  );
}
