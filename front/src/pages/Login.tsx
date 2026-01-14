// src/pages/Login.tsx - Version optimisée pour le TP
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
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { useAuthStore } from "@/lib/store"; // 🔥 Directement le store
import { authService } from "@/services/api"; // 🔥 Service API centralisé
import { STORAGE_KEYS, ROUTES } from "@/config/constants"; // 🔥 Constantes

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
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
  
  const navigate = useNavigate();
  
  // 🔥 Récupérer l'état et les méthodes du store
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 🔥 Utiliser le service API centralisé
      const response = await authService.login(data.email, data.password);
      const { user, token } = response.data;
      
      // 🔥 Mettre à jour le store
      setUser(user);
      
      // 🔥 Stocker le token (géré par les intercepteurs axios)
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      
      // Redirection
      navigate(ROUTES.DASHBOARD || "/");
      
      toast.success("Login successful!");
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <Form {...form}>
        <h1 className="text-2xl font-medium mb-4">Login</h1>
        
        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}
        
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
                  <Input 
                    placeholder="Type your email" 
                    {...field} 
                    data-testid="email-input"
                    disabled={isLoading}
                  />
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
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <Button
            className="w-full text-white bg-green-800 hover:bg-green-700"
            type="submit"
            data-testid="login-button"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      <span className="mt-4">
        Don't have an account?{" "}
        <Link 
          className="underline text-blue-800" 
          to={ROUTES.REGISTER || "/signup"}
        >
          Sign up
        </Link>
      </span>
    </div>
  );
};

export default Login;