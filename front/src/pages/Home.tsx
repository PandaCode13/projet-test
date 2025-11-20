import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getPaginationRange } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/utils/api";
import { KJTOKCAL } from "@/utils/data";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Clock, LoaderCircle, MapPin } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router";
import z from "zod";

export interface ConsumptionsResponse {
  results: Consumption[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Consumption {
  _id: string;
  product: Product;
  quantity: number;
  contributorId: ContributorId;
  place: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  barcode: string;
  imageUrl: string;
  sugar: number;
  caffeine: number;
  calories: number;
}

export interface ContributorId {
  _id: string;
  firstName: string;
  lastName: string;
}
const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
});
const Home = () => {
  const pageSize = 20;

  const [searchParams, setSearchParams] = useSearchParams();
  const paramsObj = Object.fromEntries(searchParams.entries());
  const result = searchParamsSchema.safeParse(paramsObj);
  const params = result.success ? result.data : searchParamsSchema.parse({});
  const { data: consumptions, isLoading } = useQuery<ConsumptionsResponse>({
    queryKey: ["recentConsumptions", params],
    queryFn: async () => {
      const data = (await apiFetch(
        `/consumptions?page=${params.page || 1}`
      )) as ConsumptionsResponse;

      return data;
    },
  });

  const totalPages = consumptions?.totalPages ?? 1;
  const paginationRange = useMemo(
    () => getPaginationRange(params.page, totalPages, 1),
    [params.page, totalPages]
  );
  return (
    <>
      <h1 className="md:text-2xl text-xl font-medium mb-4">
        Recent Consumptions Activity
      </h1>
      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="relative">
              <Skeleton className="h-16 w-full rounded flex items-center justify-center animate-pulse" />
              <LoaderCircle className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground opacity-40 animate-spin" />
            </div>
          )}
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {consumptions?.results.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex items-center space-x-4">
                  <div className="shrink-0 w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <img
                      className="h-20 w-20 rounded-full object-cover object-center ring-2 shadow-sm"
                      src={item.product.imageUrl}
                      alt={item.product.name}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.product.sugar
                        ? `Sugar ${item.product.sugar}g, `
                        : ""}
                      {item.product.caffeine
                        ? `Caffeine ${item.product.caffeine}g, `
                        : ""}
                      {item.product.calories
                        ? `Energy ${(item.product.calories * KJTOKCAL).toFixed(
                            2
                          )}kCal`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Added by {item.contributorId.firstName}{" "}
                      {item.contributorId.lastName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium flex items-center justify-end">
                    <Clock className="h-3 w-3 mr-1.5" />
                    {format(item.time, "PPP pp")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end">
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {item.place || "Unknown location"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* Add pagination */}
      {consumptions && (
        <Pagination className="mt-4 justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  params.page === 1 && "opacity-50 pointer-events-none",
                  "bg-green-800 text-white cursor-pointer hover:bg-green-900 hover:text-gray-200"
                )}
                onClick={() => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    page: String(params.page - 1),
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </PaginationItem>
            {paginationRange.map((p, i) => (
              <PaginationItem key={`${p}-${i}`}>
                {p === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    className={cn(
                      "bg-green-800 text-white hover:bg-green-900 hover:text-gray-200 cursor-pointer",
                      p === params.page &&
                        "pointer-events-none bg-white text-black"
                    )}
                    onClick={() => {
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        page: String(p),
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    isActive={p === params.page}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    page: String(params.page + 1),
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={cn(
                  params.page === totalPages &&
                    "opacity-50 pointer-events-none",
                  "bg-green-800 cursor-pointer text-white hover:bg-green-900 hover:text-gray-200"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default Home;
