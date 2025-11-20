import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import type { ProductsResponse } from "@/types";
import { apiFetch } from "@/utils/api";
import { KJTOKCAL } from "@/utils/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus, LoaderCircle, Search } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import z from "zod";

const searchParamsSchema = z.object({
  query: z.string().min(1, "Query is required").optional(),
  page: z.coerce.number().min(1).default(1),
  external: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

const searchFormSchema = z.object({
  query: z.string().min(1, "Query is required"),
});
const SearchProduct = () => {
  const pageSize = 50;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsObj = Object.fromEntries(searchParams.entries());
  const result = searchParamsSchema.safeParse(paramsObj);
  const params = result.success ? result.data : searchParamsSchema.parse({});

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    mode: "onChange",
    defaultValues: {
      query: "",
    },
  });
  const onSubmit = (data: z.infer<typeof searchFormSchema>) => {
    setSearchParams({ query: data.query });
  };
  // fetch results based on query
  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["searchProducts", params],
    enabled: !!params.query,
    queryFn: async () => {
      const { query, page } = params;
      const queryString = new URLSearchParams({
        query: query || "",
        page: page.toString(),
        external: "true",
      }).toString();
      console.log("Fetching with params:", queryString);
      const data = (await apiFetch(
        `/products?${queryString}`
      )) as ProductsResponse;
      console.log(data);
      return data;
    },
  });

  const count = data?.count ?? 0;
  const size = data?.page_size ?? pageSize;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(count / Math.max(1, size)));
  }, [count, size]);

  const paginationRange = useMemo(
    () => getPaginationRange(params.page, totalPages, 1),
    [params.page, totalPages]
  );

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl">Search a Product</h1>
      {params.query && <p>Showing results for "{params.query}"</p>}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2 md:w-1/2 my-4 flex-1"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center flex-1">
                <div className="flex w-full gap-2">
                  <FormControl>
                    <Input placeholder="Type your product name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                  <Button
                    className="flex gap-2 text-white bg-green-800 hover:bg-green-700"
                    type="submit"
                  >
                    <Search />
                    Search
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Card className="w-full max-w-4xl">
        <CardContent className="p-0">
          {!params.query && (
            <p className="px-6 italic opacity-60">
              Please enter a search query to find products.
            </p>
          )}
          {isLoading && (
            <div className="relative">
              <Skeleton className="h-16 w-full rounded flex items-center justify-center animate-pulse" />
              <LoaderCircle className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground opacity-40 animate-spin" />
            </div>
          )}
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {data?.products.map((item, index) => (
              <li
                key={item.code + index}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex items-center space-x-4">
                  <div className="shrink-0 w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <img
                      className="h-20 w-20 rounded-full object-cover object-center ring-2 shadow-sm"
                      src={
                        item.image_url
                          ? item.image_url
                          : "https://placehold.co/400"
                      }
                      alt={item.product_name}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {item.product_name
                        ? item.product_name
                        : item.product_name_fr}
                    </p>
                    <p className="text-xs font-semibold">{item.code}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.nutriments.sugars
                        ? `Sugar ${item.nutriments.sugars}g, `
                        : ""}
                      {item.nutriments.caffeine
                        ? `Caffeine ${item.nutriments.caffeine}g, `
                        : ""}
                      {item.nutriments.energy
                        ? `Energy ${(item.nutriments.energy * KJTOKCAL).toFixed(
                            2
                          )}kCal`
                        : ""}
                    </p>
                  </div>
                </div>
                <Button
                  className="flex gap-2 cursor-pointer items-center bg-green-800 hover:bg-green-900 text-white"
                  onClick={() =>
                    navigate(
                      `/add-consumption?product_code=${item.code}&product_name=${item.product_name}`
                    )
                  }
                >
                  <CirclePlus />
                  <p className="hidden sm:block">Add product</p>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* Add pagination */}
      {data && (
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
    </div>
  );
};
export default SearchProduct;
