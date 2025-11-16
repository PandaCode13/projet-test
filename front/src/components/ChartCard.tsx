import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard = ({
  title,
  description,
  className,
  children,
}: ChartCardProps) => (
  <Card className={cn(`h-full ${className}`)}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[300px] w-full">{children}</div>
    </CardContent>
  </Card>
);
export default ChartCard;
