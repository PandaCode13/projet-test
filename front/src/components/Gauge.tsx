import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Gauge as GaugeIcon } from "lucide-react";

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
}

const Gauge = ({ label, value, max, unit }: GaugeProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let colorClass = "text-green-500";
  if (percentage > 85) {
    colorClass = "text-red-500";
  } else if (percentage > 60) {
    colorClass = "text-yellow-500";
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <GaugeIcon className={cn("h-4 w-4 text-gray-500", colorClass)} />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full" viewBox="0 0 120 120">
            <circle
              className="text-gray-200 dark:text-gray-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
            />
            <circle
              className={cn("transition-all duration-700 ease-out", colorClass)}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="60"
              cy="60"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-xs text-gray-500">{unit}</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {percentage.toFixed(0)}% of {max} {unit}
        </p>
      </CardContent>
    </Card>
  );
};

export default Gauge;
