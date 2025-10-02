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

// Base type for data returned from the API
interface CategoryExpense {
  category: string;
  total: number;
}

// Type that includes the dynamic color property 'fill'
interface ChartData extends CategoryExpense {
  fill: string;
}

export function ChartBarExpenses() {
  // Use ChartData[] for the component state
  const [data, setData] = React.useState<ChartData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/expenses/categories");
        if (!res.ok) throw new Error("Failed to fetch category expenses");

        // Data from API is CategoryExpense[]
        const json: CategoryExpense[] = await res.json();

        // Add colors inline and ensure the result is correctly typed as ChartData[]
        const coloredData: ChartData[] = json.map((item, index) => ({
          ...item,
          // Example variation for distinct colors
          fill: `oklch(${0.488 + index * 0.1} 0.22 ${50 + index * 50})`,
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
    return data.reduce((acc, item) => {
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
              // Previous fix: Explicitly ensure the tickFormatter always returns a string.
              tickFormatter={(value: string): string => {
                const configKey = value as keyof typeof chartConfig;
                // Ensures the return value is explicitly coerced to a string.
                return String(chartConfig[configKey]?.label ?? value);
              }}
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
              // FIX for line 111: Use the data key "fill" to pull the color from the data object
              fill="fill"
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
