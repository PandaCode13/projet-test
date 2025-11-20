import { useDebounce } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { type Control } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Link } from "react-router";

export type Option = {
  value: string;
  label: string;
};

interface AsyncSelectProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  queryKey: string;
  fetcher: (query: string) => Promise<Option[]>;
  product?: Option;
}

export function AsyncSelect({
  control,
  name,
  label,
  placeholder = "Search...",
  queryKey,
  fetcher,
  product,
}: AsyncSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(product ? product.value : "");
  const [selectedLabel, setSelectedLabel] = useState<string>(
    product ? product.label : ""
  );

  const debouncedQuery = useDebounce(inputValue, 300);

  const {
    data: options = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [queryKey, debouncedQuery],
    enabled: !!debouncedQuery && !!product,
    queryFn: () => fetcher(debouncedQuery),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Logic: If the option is currently in the list, grab its label.
        // If not (e.g., we searched for something else), fall back to our manually stored label.
        const currentOption = options.find((op) => op.value === field.value);
        const displayLabel =
          currentOption?.label || selectedLabel || "Select item";

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? displayLabel : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="end">
                {/* shouldFilter={false} is CRITICAL for server-side filtering */}
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={placeholder}
                    value={inputValue}
                    onValueChange={setInputValue}
                  />
                  <CommandList>
                    {/* Loading Spinner */}
                    {(isLoading || isFetching) && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}

                    {/* No Results */}
                    {!isFetching && options.length === 0 && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    {/* Options */}
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => {
                            field.onChange(option.value); // Update Form Value
                            setSelectedLabel(option.label); // Save Label for display
                            setOpen(false); // Close Popover
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              option.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription className="italic -mb-2">
              If you don't see your product, use the{" "}
              <Link className="underline text-blue-800" to="/search">
                products search page
              </Link>
              .
            </FormDescription>
            <FormMessage className="text-red-600" />
          </FormItem>
        );
      }}
    />
  );
}
