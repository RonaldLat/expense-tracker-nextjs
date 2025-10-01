"use client";

import ExpenseChartLineInteractive from "@/components/ExpenseChartLineInteractive";
import  { LineChartMod } from "@/components/charts/LineChartMod";
import { useEffect, useState } from "react";

type SummaryItem = {
  category: string;
  total: number;
};

export default function ExpenseSummary() {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading summary...</p>;
  if (!summary.length) return <p>No expenses yet.</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Monthly Expense Summary</h2>
      <ul>
        {summary.map((item) => (
          <li key={item.category} className="flex justify-between">
            <span>{item.category}</span>
            <span>KES {item.total}</span>
          </li>
        ))}
      </ul>
      <LineChartMod />
      <ExpenseChartLineInteractive />
    </div>
  );
}
