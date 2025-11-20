import { Minus, TrendingDown, TrendingUp } from "lucide-react";

const TrendIcon = ({ trend }: { trend: string }) =>
  trend === "increasing" ? (
    <TrendingUp className="h-5 w-5 text-red-500" />
  ) : trend === "decreasing" ? (
    <TrendingDown className="h-5 w-5 text-green-500" />
  ) : (
    <Minus className="h-5 w-5 text-gray-500" />
  );
  
export default TrendIcon;
