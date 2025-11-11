import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import z from "zod";

const loginFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
    console.log(data);
  };
  return (
    <div className="flex flex-col items-center">
      <Form {...form}>
        <h1 className="text-2xl font-medium mb-4">Login</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:w-1/2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Type your email" {...field} />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Type your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <Button
            className="w-full text-white bg-green-800 hover:bg-green-700"
            type="submit"
          >
            Login
          </Button>
        </form>
      </Form>
      <span className="mt-4">
        Dont't have an account?{" "}
        <Link className="underline text-blue-800" to="/signup">
          Sign up
        </Link>
      </span>
    </div>
  );
};

export default Login;
