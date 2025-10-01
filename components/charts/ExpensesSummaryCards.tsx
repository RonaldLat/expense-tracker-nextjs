"use client";

import * as React from "react";

interface CategoryExpense {
  category: string;
  total: number;
}

export function ExpenseSummaryCards() {
  const [data, setData] = React.useState<CategoryExpense[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/expenses/categories");
        if (!res.ok) throw new Error("Failed to fetch category expenses");
        const json: CategoryExpense[] = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p style={{ color: "#0.141 0.005 285.823" }}>Loading summary...</p>;
  }

  const totalExpenses = data.reduce((sum, item) => sum + item.total, 0);
  const mostSpent = data.reduce(
    (max, item) => (item.total > max.total ? item : max),
    { category: "", total: 0 },
  );
  const monthsCount = 12;
  const averagePerMonth = totalExpenses / monthsCount;
  const categoryCount = data.length;

  const cardStyle: React.CSSProperties = {
    padding: "1rem",
    borderRadius: "0.65rem",
    border: "1px solid oklch(0.92 0.004 286.32)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    backgroundColor: "oklch(1 0 0)",
    color: "oklch(0.141 0.005 285.823)",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div style={cardStyle}>
        <h3 style={{ fontWeight: 600 }}>Total Expenses</h3>
        <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
          Ksh. {totalExpenses.toLocaleString()}
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontWeight: 600 }}>Most Spent Category</h3>
        <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
          {mostSpent.category}
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontWeight: 600 }}>Average per Month</h3>
        <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
          Ksh. {averagePerMonth.toFixed(2)}
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontWeight: 600 }}>Number of Categories</h3>
        <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
          {categoryCount}
        </p>
      </div>
    </div>
  );
}
