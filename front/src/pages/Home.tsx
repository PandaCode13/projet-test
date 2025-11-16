import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Home = () => {
  // TODO: Fetch and display consumption timeline data
  type ConsumptionItem = {
    id: number;
    product: string;
    sugar: number;
    caffeine: number;
    calories: number;
    time: string;
    location: string;
  };

  const items: ConsumptionItem[] = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    product: "Redbull 250ml",
    sugar: 27,
    caffeine: 80,
    calories: 110,
    time: "3:00 PM",
    location: "Kitchen",
  }));

  return (
    <>
      <h1 className="md:text-2xl text-xl font-medium mb-4">
        Recent Consumptions Activity
      </h1>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex items-center space-x-4">
                  <div className="shrink-0 w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <img
                      className="h-20 w-20 rounded-full object-cover object-center ring-2 shadow-sm"
                      src="https://images.openfoodfacts.org/images/products/900/249/021/5408/front_sv.19.full.jpg"
                      alt="Redbull 250ml"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.product}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.sugar}g Sug, {item.caffeine}mg Caf, {item.calories}{" "}
                      kCal
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Added by User X
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium flex items-center justify-end">
                    <Clock className="h-3 w-3 mr-1.5" />
                    {item.time}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end">
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {item.location}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* Add pagination */}
      <Pagination className="mt-4 justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className="bg-green-800 text-white hover:bg-green-900 hover:text-gray-200"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className="bg-green-800 text-white hover:bg-green-900 hover:text-gray-200"
              href="#"
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              className="bg-green-800 text-white hover:bg-green-900 hover:text-gray-200"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default Home;
