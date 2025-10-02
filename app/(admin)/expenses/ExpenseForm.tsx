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
import { Category } from "./page";

interface ExpenseFormProps {
  categories: Category[];
  onExpenseAdded: (expense: any) => void;
}

export function ExpenseForm({ categories, onExpenseAdded }: ExpenseFormProps) {
  const [title, setTitle] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          categoryId: categoryId === "none" ? null : categoryId,
          date,
          notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      const newExpense = await res.json();
      onExpenseAdded(newExpense);

      // ✅ Clear form
      setTitle("");
      setAmount("");
      setCategoryId(null);
      setDate(new Date());
      setNotes("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-4 rounded-lg border p-4 shadow-sm"
    >
      {/* Title */}
      <Input
        placeholder="Expense title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Amount */}
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      {/* Category */}
      <Select
        onValueChange={(value) => setCategoryId(value)}
        value={categoryId ?? undefined}
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

      {/* Date Picker */}
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
      />

      {/* Notes */}
      <Input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Adding..." : "Add Expense"}
      </Button>
    </form>
  );
}
