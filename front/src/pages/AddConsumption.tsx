import { AsyncSelect } from "@/components/AsyncSelect";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/hooks";
import type { DbProductsResponse } from "@/types";
import { apiFetch } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import z from "zod";

const addConsumptionFormSchema = z.object({
  date: z.date(),
  time: z.string().optional(),
  product: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  place: z.string().optional(),
  notes: z.string().optional(),
});
const productParamsSchema = z.object({
  product_code: z.string().optional(),
  product_name: z.string().optional(),
});

const AddConsumption = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramsObj = Object.fromEntries(searchParams.entries());
  const result = productParamsSchema.safeParse(paramsObj);
  const params = result.success ? result.data : productParamsSchema.parse({});

  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const { data: product } = useQuery({
    queryKey: ["product", params.product_code],
    enabled: !!params.product_code,
    queryFn: async () => {
      if (!params.product_code) return null;
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(
          params.product_code
        )}.json?fields=image_url,product_name,product_name_fr,brands,nutriments`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }
      return res.json();
    },
  });

  const form = useForm<z.infer<typeof addConsumptionFormSchema>>({
    resolver: zodResolver(addConsumptionFormSchema),
    mode: "onChange",
    defaultValues: {
      date: new Date(),
      time: "10:00:00",
      product: params.product_name || "",
      quantity: 1,
      place: "",
      notes: "",
    },
  });
  // const productMutation = useMutation({
  //   mutationFn: async () => {
  //     if (!product) return;
  //     const res = await apiFetch(`/products`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         barcode: params.product_code,
  //         name: product.product.product_name_fr || product.product.product_name,
  //         brand: product.product.brands,
  //         image_url: product.product.image_url,
  //         energy: product.product.nutriments.energy,
  //         sugar: product.product.nutriments.sugars || 0,
  //         caffeine: product.product.nutriments.caffeine || 0,
  //       }),
  //     });
  //     return res;
  //   },
  // });
  const consumptionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof addConsumptionFormSchema>) => {
      if (product == null) return;
      const res = await apiFetch(`/consumptions`, {
        method: "POST",
        body: JSON.stringify({
          product: {
            name:
              product.product.product_name_fr || product.product.product_name,
            barcode: product.code,
            brand: product.product.brands || "",
            imageUrl: product.product.image_url || "",
            sugar: product.product.nutriments.sugars || 0,
            calories: product.product.nutriments.energy || 0,
            caffeine: product.product.nutriments.caffeine || 0,
          },
          consumption: {
            date: data.date,
            time: data.time,
            quantity: data.quantity,
            place: data.place,
            notes: data.notes,
          },
        }),
      });
      return res;
    },
  });
  const onSubmit = (data: z.infer<typeof addConsumptionFormSchema>) => {
    console.log(data);
    if (!user) {
      toast.error("You must be logged in to add a consumption.");
      return;
    }
    consumptionMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Consumption added successfully!");
        form.reset();
        navigate("/");
      },
      onError: () => {
        toast.error("Failed to add consumption. Please try again.");
      },
    });
  };
  useEffect(() => {
    if (!user) {
      console.log("effect user toast", user);
      toast.error("You must be logged in to add a consumption.");
    }
  }, [user]);
  const fetchProducts = async (query: string): Promise<any> => {
    console.log(query);
    const data = (await apiFetch(
      `/products?query=${query}&external=false`
    )) as DbProductsResponse;
    const options = data.results.map((item) => ({
      value: item._id,
      label: item.name,
    }));
    return options;
  };
  return (
    <div className="flex flex-col items-center">
      <Form {...form}>
        <h1 className="text-2xl font-medium mb-4">Add Consumption</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:w-1/2"
        >
          <AsyncSelect
            control={form.control}
            name="product"
            label="Product"
            placeholder="Search for a product..."
            queryKey="products-search"
            fetcher={fetchProducts}
            product={{
              label: params.product_name || "",
              value: params.product_code || "",
            }}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value && format(field.value, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpen(false);
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="time"
                    step="1"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input placeholder="Quantity" {...field} />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Place{" "}
                  <span className="text-gray-500 font-light">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Place" {...field} />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Notes{" "}
                  <span className="text-gray-500 font-light">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Notes" {...field} />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <Button
            className="w-full text-white cursor-pointer bg-green-800 hover:bg-green-700"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default AddConsumption;
