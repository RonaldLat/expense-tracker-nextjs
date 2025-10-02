"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Expense } from "./page";

interface EditExpenseFormProps {
  expense: Expense;
  categories: Category[];
  onClose: () => void;
  onUpdated: (expense: Expense) => void;
}

export function EditExpenseForm({
  expense,
  categories,
  onClose,
  onUpdated,
}: EditExpenseFormProps) {
  const [title, setTitle] = React.useState(expense.title);
  const [amount, setAmount] = React.useState(String(expense.amount));
  const [categoryId, setCategoryId] = React.useState<string | null>(
    expense.categoryId ?? null,
  );
  const [date, setDate] = React.useState<Date | undefined>(
    expense.date ? new Date(expense.date) : new Date(),
  );
  const [notes, setNotes] = React.useState(expense.notes ?? "");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          categoryId: categoryId === "none" ? null : categoryId,
          date,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to update expense");

      const updated = await res.json();
      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg space-y-4">
        <h2 className="text-lg font-semibold">Edit Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Select
            onValueChange={(value) => setCategoryId(value)}
            value={categoryId ?? "none"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="none">No Category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
          />

          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
