"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A linear line chart showing monthly expenses";

const chartConfig = {
  total: {
    label: "Expenses",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartLineLinear() {
  const [data, setData] = useState<{ month: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonthlyExpenses() {
      try {
        const res = await fetch("/api/expenses/monthly");
        if (!res.ok) throw new Error("Failed to fetch expenses");
        const json = await res.json();

        // Sort by month ascending (oldest first)
        const sorted = json.sort((a: any, b: any) =>
          a.month.localeCompare(b.month),
        );

        setData(sorted);
      } catch (error) {
        console.error("Expense monthly fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMonthlyExpenses();
  }, []);

  if (loading) {
    return <div>Loading chart...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Linear</CardTitle>
        <div className="text-muted-foreground text-sm">Aggregated by month</div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value + "-01");
                return date.toLocaleString("default", { month: "short" });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="total"
              type="linear"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total expenses for previous months
        </div>
      </CardFooter>
    </Card>
  );
}
