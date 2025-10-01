import { MonthlyPieChart } from "@/components/charts/MonthlyPieChart";
import { ExpensesPieChart } from "@/components/charts/ExpensesPieChart";
import { ExpenseSummaryCards } from "@/components/charts/ExpensesSummaryCards";
import { ChartBarExpenses } from "@/components/charts/ChartBarExpenses";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <MonthlyPieChart />
      <ExpensesPieChart />
      <ExpenseSummaryCards />
      <ChartBarExpenses/>

      {/* You can add more cards here */}
      <div className="hidden text-gray-900 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example cards */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h3 className="font-semibold">Total Expenses</h3>
          <p className="text-2xl mt-2">$12,345</p>
        </div>

        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h3 className="font-semibold">Most Spent Category</h3>
          <p className="text-2xl mt-2">Food</p>
        </div>

        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h3 className="font-semibold">Average per Month</h3>
          <p className="text-2xl mt-2">$2,345</p>
        </div>
      </div>
    </div>
  );
}
