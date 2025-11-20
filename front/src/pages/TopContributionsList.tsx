import type { TopCaffeine, TopCalory, TopSugar } from "@/types";

interface TopContributionsListProps {
  title: string;
  items: TopSugar[] | TopCaffeine[] | TopCalory[];
  remainingPercentage?: number;
}

const TopContributionsList = ({
  title,
  items,
  remainingPercentage,
}: TopContributionsListProps) => (
  <div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <ul className="space-y-1">
      {items!.map((item) => (
        <li key={item.name} className="flex justify-between text-sm">
          <span>{item.name}</span>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {(Math.round(item.percentage * 100) / 100).toFixed(2)}%
          </span>
        </li>
      ))}
      {remainingPercentage !== undefined && (
        <li className="flex justify-between text-sm">
          <span>Others</span>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {remainingPercentage.toFixed(2)}%
          </span>
        </li>
      )}
    </ul>
  </div>
);
export default TopContributionsList;
