import { MOCK_DATA as data } from "@/utils/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, User } from "lucide-react";

const Analytics = () => {
  const TrendIcon =
    data.analytics.summary.trend === "increasing" ? (
      <TrendingUp className="h-5 w-5 text-red-500" />
    ) : data.analytics.summary.trend === "decreasing" ? (
      <TrendingDown className="h-5 w-5 text-green-500" />
    ) : (
      <Minus className="h-5 w-5 text-gray-500" />
    );

  const TrendText =
    data.analytics.summary.trend.charAt(0).toUpperCase() +
    data.analytics.summary.trend.slice(1);

  const TopContributorList = ({ title, items }) => (
    <div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.slice(0, 5).map((item) => (
          <li key={item.name} className="flex justify-between text-sm">
            <span>{item.name}</span>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              {item.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

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
              {data.analytics.topConsumedProducts.map((item, index) => (
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
            <TopContributorList
              title="By Sugar"
              items={data.analytics.topContributors.sugar}
            />
            <TopContributorList
              title="By Caffeine"
              items={data.analytics.topContributors.caffeine}
            />
            <TopContributorList
              title="By Calories"
              items={data.analytics.topContributors.calories}
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
                {data.analytics.summary.dailyAvgSugar} g
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Daily Avg. Caffeine
              </span>
              <span className="text-base font-bold">
                {data.analytics.summary.dailyAvgCaffeine} mg
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Days Exceeding Intake
              </span>
              <span className="text-base font-bold">
                {data.analytics.summary.daysExceeding} /{" "}
                {data.analytics.summary.totalDays}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Overall Trend
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold">{TrendText}</span>
                {TrendIcon}
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
            {[
              { name: "user1", count: 10 },
              { name: "user2", count: 3 },
            ].map((user, index) => (
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
                <span className="font-semibold">{user.count}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
export default Analytics;
