import ChartCard from "@/components/ChartCard";
import Gauge from "@/components/Gauge";
import StatCard from "@/components/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStatistics } from "@/types";
import { apiFetch } from "@/utils/api";
import { MOCK_DATA as data, KJTOKCAL } from "@/utils/data";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Coffee,
  Droplet,
  LoaderCircle,
  Trophy,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const THRESHOLD_SUGAR = 50; // grams
const THRESHOLD_CAFFEINE = 400; // mg
const THRESHOLD_CALORIES = 2000; // kcal

const Dashboard = () => {
  const { data, isLoading } = useQuery<DashboardStatistics>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = (await apiFetch("/dashboard")) as DashboardStatistics;
      return res;
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <div className="relative">
          <Skeleton className="h-16 w-full rounded flex items-center justify-center animate-pulse" />
          <LoaderCircle className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground opacity-40 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Gauge
              label="Sugar"
              value={data?.latestStats.totalSugar ?? 0}
              max={THRESHOLD_SUGAR}
              unit="g"
            />
            <Gauge
              label="Caffeine"
              value={data ? data.latestStats.totalCaffeine * 1000 : 0}
              max={THRESHOLD_CAFFEINE}
              unit="mg"
            />
            <Gauge
              label="Calories"
              value={
                data
                  ? Number(
                      (data.latestStats.totalCalories * KJTOKCAL).toFixed(2)
                    )
                  : 0
              }
              max={THRESHOLD_CALORIES}
              unit="kCal"
              textStyle="text-xl"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard
              title="Sugar by Day"
              description="Last 7 days sugar consumption"
              className="bg-transparent dark:bg-transparent border-none shadow-none"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.sugarByDay}>
                  <XAxis
                    dataKey="_id"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}g`}
                  />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar
                    dataKey="totalSugar"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Caffeine by Time"
              description="Today's caffeine consumption pattern"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.caffeineEvolution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <XAxis
                    dataKey="hour"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit="mg"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeCaffeine"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    className="stroke-green-500"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Stats and Alerts */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 grid gap-6 grid-cols-2">
              <StatCard
                title="Avg. Sugar / Day"
                value={`${data?.avgDailySugar.toFixed(2)} g`}
                description="Last 30 days"
                icon={<Droplet className="h-4 w-4 text-gray-500" />}
              />
              <StatCard
                title="Avg. Caffeine / Day"
                value={`${data?.avgDailyCaffeine.toFixed(2)} mg`}
                description="Last 30 days"
                icon={<Coffee className="h-4 w-4 text-gray-500" />}
              />
              <StatCard
                title="Most Consumed"
                value={data?.mostConsumedProduct.name ?? ""}
                description="Last 30 days"
                icon={<Trophy className="h-4 w-4 text-gray-500" />}
              />
              <StatCard
                title="Top Sugar Contributor"
                value={data?.topSugarProduct.name ?? ""}
                description="Product with most sugar"
                icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                details={
                  <>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total sugar: {data?.topSugarProduct.totalSugar} g
                    </p>
                  </>
                }
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Alert History</CardTitle>
                <CardDescription>Days you exceeded limits.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {data?.alertHistory.map((date) => (
                    <li key={date.date} className="flex items-center text-sm">
                      <AlertTriangle className="h-4 w-4 mr-3 text-red-500 shrink-0" />
                      <span>{date.date}</span>
                      <p className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {date.exceeded.map((item) => item).join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;
