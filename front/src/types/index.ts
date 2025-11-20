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
    energy?: number
    sugars?: number
    caffeine?:number
  }
  product_name: string
  product_name_fr?: string
}

export interface DbProductsResponse {
  results: Result[]
  total: number
  page: number
  totalPages: number
}

export interface Result {
  _id: string
  name: string
  barcode: string
  brand: string
  imageUrl: string
  sugar: number
  caffeine: number
  calories: number
}
