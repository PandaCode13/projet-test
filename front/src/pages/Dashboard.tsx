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
import { MOCK_DATA as data } from "@/utils/data";
import { AlertTriangle, Coffee, Droplet, Trophy } from "lucide-react";
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

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Gauges */}
      <div className="grid gap-6 md:grid-cols-3">
        <Gauge
          label="Sugar"
          value={data.todayMetrics.sugar.value}
          max={data.todayMetrics.sugar.max}
          unit="g"
        />
        <Gauge
          label="Caffeine"
          value={data.todayMetrics.caffeine.value}
          max={data.todayMetrics.caffeine.max}
          unit="mg"
        />
        <Gauge
          label="Calories"
          value={data.todayMetrics.calories.value}
          max={data.todayMetrics.calories.max}
          unit="kCal"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Sugar by Day"
          description="Last 7 days sugar consumption"
          className="bg-transparent dark:bg-transparent border-none shadow-none"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.sugarByDay}>
              <XAxis
                dataKey="day"
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
              <Bar dataKey="sugar" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Caffeine by Time"
          description="Today's caffeine consumption pattern"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.caffeineByTime}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--muted-foreground))"
              />
              <XAxis
                dataKey="time"
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
                dataKey="caffeine"
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
            value={`${data.dashboardStats.avgSugarPerDay} g`}
            description="Last 30 days"
            icon={<Droplet className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            title="Avg. Caffeine / Day"
            value={`${data.dashboardStats.avgCaffeinePerDay} mg`}
            description="Last 30 days"
            icon={<Coffee className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            title="Most Consumed"
            value={data.dashboardStats.mostConsumedProduct}
            description="Last 30 days"
            icon={<Trophy className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            title="Top Sugar Contributor"
            value={data.dashboardStats.topSugarContributor}
            description="Product with most sugar"
            icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alert History</CardTitle>
            <CardDescription>Days you exceeded limits.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.alertHistory.map((date) => (
                <li key={date} className="flex items-center text-sm">
                  <AlertTriangle className="h-4 w-4 mr-3 text-red-500 shrink-0" />
                  <span>{date}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
