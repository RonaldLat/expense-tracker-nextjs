"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ExpenseItem = {
  date: string;
  amount: number;
};

export default function ExpenseChartLineInteractive() {
  const [data, setData] = React.useState<ExpenseItem[]>([]);
    "desktop"
  );

  const chartConfig = {
    desktop: { label: "Expenses", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  React.useEffect(() => {
    fetch("/api/expenses/monthly")
      .then(async (res) => {
        try {
          const json: ExpenseItem[] = await res.json();
          setData(json.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } catch (err) {
          console.error("Failed to parse JSON from /api/expenses/monthly:", err);
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch expenses:", err);
        setData([]);
      });
  }, []);

  const total = React.useMemo(
    () => ({
      desktop: data.reduce((acc, curr) => acc + curr.amount, 0),
    }),
    [data]
  );

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Monthly Expense Trend</CardTitle>
          <CardDescription>
            Total expenses per month
          </CardDescription>
        </div>
        <div className="flex">
          <button
            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
            onClick={() => setActiveChart("desktop")}
          >
            <span className="text-muted-foreground text-xs">
              {chartConfig.desktop.label}
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {total.desktop.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="amount"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              dataKey="amount"
              type="monotone"
              stroke={chartConfig.desktop.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
