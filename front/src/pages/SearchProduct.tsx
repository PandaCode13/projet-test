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
import { apiFetch } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Clock, LoaderCircle, MapPin, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
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

  const [searchParams, setSearchParams] = useSearchParams();
  const paramsObj = Object.fromEntries(searchParams.entries());
  const result = searchParamsSchema.safeParse(paramsObj);
  const params = result.success ? result.data : searchParamsSchema.parse({});
  // const [data, setData] = useState([]);

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
  const { data, isLoading } = useQuery({
    queryKey: ["searchProducts", params],
    queryFn: async () => {
      const { query, page, external } = params;
      const queryString = new URLSearchParams({
        query: query || "",
        page: page.toString(),
        external: external ? "true" : "false",
      }).toString();
      console.log("Fetching with params:", queryString);
      const data = await apiFetch(`/api/products?${queryString}`);
      return Array.isArray(data) ? data : [];
    },
  });

  // useEffect(() => {
  //   async function fetchResults() {
  //     const { query, page, external } = params;
  //     const queryString = new URLSearchParams({
  //       query: query || "",
  //       page: page.toString(),
  //       external: external ? "true" : "false",
  //     }).toString();

  //     const response = await apiFetch(`/api/products?${queryString}`);
  //     const dataJson = await (response as Response).json();
  //     setData(Array.isArray(dataJson) ? dataJson : []);
  //   }
  //   fetchResults();
  // }, [params]);
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
          {isLoading && (
            <div className="relative">
              <Skeleton className="h-16 w-full rounded flex items-center justify-center animate-pulse" />
              <LoaderCircle className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground opacity-40 animate-spin" />
            </div>
          )}
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
            <PaginationLink
              className="bg-green-800 text-white hover:bg-green-900 hover:text-gray-200"
              href="#"
            >
              2
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
    </div>
  );
};
export default SearchProduct;
