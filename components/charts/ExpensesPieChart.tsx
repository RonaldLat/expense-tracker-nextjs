"use client";

import * as React from "react";
import { Pie, PieChart, Sector, Label } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "Interactive pie chart showing category expenses";

interface CategoryExpense {
  category: string;
  total: number;
  fill?: string;
  key?: string;
}

export function ExpensesPieChart() {
  const id = "expenses-pie";
  const [data, setData] = React.useState<CategoryExpense[]>([]);
  const [activeCategoryKey, setActiveCategoryKey] = React.useState<string>("");

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/expenses/categories");
        if (!res.ok) throw new Error("Failed to fetch category expenses");
        const json: CategoryExpense[] = await res.json();

        // Assign dynamic colors and unique keys
        const coloredData = json.map((item, index) => ({
          ...item,
          fill: `var(--chart-${(index % 5) + 1})`,
          key: `${item.category}-${index}`,
        }));

        setData(coloredData);
        if (coloredData.length > 0) setActiveCategoryKey(coloredData[0].key!);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.key === activeCategoryKey),
    [activeCategoryKey, data],
  );

  const chartConfig: ChartConfig = React.useMemo(
    () =>
      data.reduce((acc, item) => {
        acc[item.key!] = { label: item.category, color: item.fill! };
        return acc;
      }, {} as ChartConfig),
    [data],
  );

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Category Expenses</CardTitle>
          <CardDescription>Monthly breakdown</CardDescription>
        </div>

        <Select value={activeCategoryKey} onValueChange={setActiveCategoryKey}>
          <SelectTrigger
            className="ml-auto h-7 w-[150px] rounded-lg pl-2.5"
            aria-label="Select category"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {data.map((item) => (
              <SelectItem
                key={item.key}
                value={item.key!}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-xs"
                    style={{ backgroundColor: item.fill }}
                  />
                  {item.category}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="total" hideLabel />}
            />
            <Pie
              data={data}
              dataKey="total"
              nameKey="key"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const activeItem = data[activeIndex];
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeItem?.total?.toLocaleString() ?? 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {activeItem?.category ?? ""}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
