import TrendIcon from "@/components/TrendIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AnalyticResponse } from "@/types";
import { apiFetch } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, User } from "lucide-react";
import TopContributionsList from "./TopContributionsList";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
  const { data, isLoading } = useQuery<AnalyticResponse>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = (await apiFetch("/analytics")) as AnalyticResponse;
      return response;
    },
  });
  const sugarTrendText = data?.trend?.[0]?.sugarTrend
    ? data.trend[0].sugarTrend.charAt(0).toUpperCase() +
      data.trend[0].sugarTrend.slice(1)
    : "";
  const caffeineTrendText = data?.trend?.[0]?.sugarTrend
    ? data.trend[0].caffeineTrend.charAt(0).toUpperCase() +
      data.trend[0].caffeineTrend.slice(1)
    : "";
  if (isLoading) {
    return (
      <div className="relative">
        <Skeleton className="h-16 w-full rounded flex items-center justify-center animate-pulse" />
        <LoaderCircle className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground opacity-40 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top 10 Consumed Products</CardTitle>
            <CardDescription>
              By consumption count (last 30 days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {data?.topProducts.map((item, index) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 w-6 font-medium">
                      {index + 1}.
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.count}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Contributions</CardTitle>
            <CardDescription>Products driving your intake</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TopContributionsList
              title="By Sugar"
              items={data?.topNutrients[0].topSugar!}
              remainingPercentage={
                data?.topNutrients[0].remainingSugarPercentage
              }
            />
            <TopContributionsList
              title="By Caffeine"
              items={data?.topNutrients[0].topCaffeine!}
              remainingPercentage={
                data?.topNutrients[0].remainingCaffeinePercentage
              }
            />
            <TopContributionsList
              title="By Calories"
              items={data?.topNutrients[0].topCalories!}
              remainingPercentage={
                data?.topNutrients[0].remainingCaloriesPercentage
              }
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Your 30-day overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Daily Avg. Sugar
              </span>
              <span className="text-base font-bold">
                {data?.dailySummary[0].avgSugar.toFixed(2)} g
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Daily Avg. Caffeine
              </span>
              <span className="text-base font-bold">
                {(data?.dailySummary[0].avgCaffeine! * 1000).toFixed(2)} mg
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Days Exceeding Intake
              </span>
              <span className="text-base font-bold">
                {data?.exceededDays[0].numExceededDays} /{" 30"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Sugar Overall Trend
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold">{sugarTrendText}</span>
                <TrendIcon trend={data?.trend[0].sugarTrend!} />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Caffeine Overall Trend
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold">{caffeineTrendText}</span>
                <TrendIcon trend={data?.trend[0].caffeineTrend!} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="max-w-6xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="inline-block mr-2 h-5 w-5" />
            Top Contributors
          </CardTitle>
          <CardDescription>Most active users</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {data?.topContributors.map((user, index) => (
              <li
                key={user.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400 w-6 font-medium">
                    {index + 1}.
                  </span>
                  <span>{user.name}</span>
                </div>
                <span className="font-semibold">{user.totalContributions}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
export default Analytics;
