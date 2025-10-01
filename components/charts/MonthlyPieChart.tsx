"use client";

import { Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export const description = "Category expenses pie chart with legend";

interface CategoryExpense {
  category: string;
  total: number;
}

export function MonthlyPieChart() {
  const [data, setData] = useState<CategoryExpense[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/expenses/categories");
        if (!res.ok) throw new Error("Failed to fetch category expenses");
        const json: CategoryExpense[] = await res.json();

        // Add `fill` dynamically for Recharts
        const coloredData = json.map((item, index) => ({
          ...item,
          fill: `var(--chart-${(index % 5) + 1})`, // cycle through chart colors
          key: `${item.category}-${index}`, // unique key
        }));
        setData(coloredData);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // Build chartConfig dynamically
  const chartConfig: ChartConfig = data.reduce((acc, item) => {
    acc[item.category] = { label: item.category, color: item.fill };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Expenses</CardTitle>
        <CardDescription>Monthly breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              // unique key for each slice
              key={(entry) => entry.key}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
