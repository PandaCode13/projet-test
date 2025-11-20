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

export interface DashboardStatistics {
  latestStats: LatestStats
  sugarByDay: SugarByDay[]
  caffeineEvolution: CaffeineEvolution[]
  avgDailySugar: number
  avgDailyCaffeine: number
  mostConsumedProduct: MostConsumedProduct
  topSugarProduct: TopSugarProduct
  alertHistory: AlertHistory[]
}

export interface LatestStats {
  _id: string
  date: string
  totalConsumptions: number
  totalSugar: number
  totalCaffeine: number
  totalCalories: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface SugarByDay {
  _id: string
  totalSugar: number
}

export interface CaffeineEvolution {
  cumulativeCaffeine: number
  hour: number
}

export interface MostConsumedProduct {
  _id: string
  name: string
  brand: string
  barcode: string
  imageUrl: string
  sugar: number
  caffeine: number
  calories: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface TopSugarProduct {
  _id: string
  name: string
  totalSugar: number
}

export interface AlertHistory {
  date: string
  exceeded: string[]
}

export interface AnalyticResponse {
  topProducts: TopProduct[]
  topNutrients: TopNutrient[]
  topContributors: TopContributor[]
  dailySummary: DailySummary[]
  exceededDays: ExceededDay[]
  trend: Trend[]
}

export interface TopProduct {
  _id: string
  name: string
  count: number
}

export interface TopNutrient {
  topSugar: TopSugar[]
  remainingSugarPercentage: number
  topCaffeine: TopCaffeine[]
  remainingCaffeinePercentage: number
  topCalories: TopCalory[]
  remainingCaloriesPercentage: number
}

export interface TopSugar {
  name: string
  value: number
  percentage: number
}

export interface TopCaffeine {
  name: string
  value: number
  percentage: number
}

export interface TopCalory {
  name: string
  value: number
  percentage: number
}

export interface TopContributor {
  _id: string
  totalContributions: number
  name: string
}

export interface DailySummary {
  _id: string
  avgSugar: number
  avgCaffeine: number
}

export interface ExceededDay {
  numExceededDays: number
}

export interface Trend {
  _id: string
  sugarTrend: string
  caffeineTrend: string
}
