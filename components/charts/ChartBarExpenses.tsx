"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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

export const description = "Bar chart showing category expenses";

interface CategoryExpense {
  category: string;
  total: number;
}

export function ChartBarExpenses() {
  const [data, setData] = React.useState<CategoryExpense[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/expenses/categories");
        if (!res.ok) throw new Error("Failed to fetch category expenses");
        const json: CategoryExpense[] = await res.json();

        // Add colors inline
        const coloredData = json.map((item, index) => ({
          ...item,
          fill: `oklch(${0.488 + index * 0.1} 0.22 ${50 + index * 50})`, // example variation
        }));

        setData(coloredData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const chartConfig: ChartConfig = React.useMemo(() => {
    return data.reduce((acc, item, index) => {
      acc[item.category] = { label: item.category, color: item.fill };
      return acc;
    }, {} as ChartConfig);
  }, [data]);

  if (loading)
    return (
      <p style={{ color: "oklch(0.141 0.005 285.823)" }}>Loading chart...</p>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Monthly breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="total"
              layout="vertical"
              radius={5}
              fill={({ index }) => data[index].fill}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex hidden gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total expenses per category for the last month
        </div>
      </CardFooter>
    </Card>
  );
}
