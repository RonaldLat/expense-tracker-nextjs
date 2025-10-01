"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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

export const description = "A line chart showing monthly expenses";

const chartConfig = {
  desktop: {
    label: "Expenses",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ExpensesLineChart() {
  const [chartData, setChartData] = useState<{ month: string; desktop: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonthlyExpenses() {
      try {
        const res = await fetch("/api/expenses/monthly");
        if (!res.ok) throw new Error("Failed to fetch monthly expenses");
        const data = await res.json();
        setChartData(data);
      } catch (error) {
        console.error("Expense monthly fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMonthlyExpenses();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          {loading ? "Loading..." : "Showing last 6 months"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
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
                const parts = value.split("-");
                return parts.length === 2 ? `${parts[1]}/${parts[0].slice(2)}` : value;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
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
          Showing total expenses for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
