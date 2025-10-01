"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  amount: number;
  description?: string;
  date: string;
  categoryId: string;
  category?: Category;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch expenses and categories
  useEffect(() => {
    async function fetchData() {
      try {
        const [expRes, catRes] = await Promise.all([
          fetch("/api/expenses"),
          fetch("/api/categories")
        ]);

        if (!expRes.ok) throw new Error("Failed to fetch expenses");
        if (!catRes.ok) throw new Error("Failed to fetch categories");

        const expData: Expense[] = await expRes.json();
        const catData: Category[] = await catRes.json();

        setExpenses(expData);
        setCategories(catData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle adding a new expense
  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount, categoryId, notes }),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      const newExpense: Expense = await res.json();
      setExpenses([newExpense, ...expenses]);
      setTitle("");
      setAmount(0);
      setCategoryId("");
      setNotes("");
    } catch (err: any) {
      console.error("Expense create error:", err);
      setError(err.message || "Failed to add expense");
    }
  }

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Expenses</h1>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} className="space-y-3 border p-4 rounded shadow">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="border p-2 w-full rounded"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Expense
        </button>
      </form>

      {/* Expenses List */}
      <div className="space-y-2">
        {expenses.map((expense) => (
          <div key={expense.id} className="border p-3 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{expense.description || expense.title}</p>
              <p className="text-sm text-gray-500">
                {expense.category?.name || "No Category"} — {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <p className="font-bold">${expense.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
