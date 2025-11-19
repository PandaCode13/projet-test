export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // hashé
}

export interface AuthContextValue {
  user: User | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  register: ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export interface ProductsResponse {
  count: number
  page: number
  page_count: number
  page_size: number
  products: Product[]
  skip: number
}

export interface Product {
  brands: string
  code: string
  image_url: string
  nutriments: {
    "energy-kcal_value"?: number
    sugars?: number
    caffeine?:number
  }
  product_name: string
  product_name_fr?: string
}

