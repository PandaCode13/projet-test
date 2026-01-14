// src/pages/Dashboard.tsx - Version corrigée
import ChartCard from "@/components/ChartCard";
import Gauge from "@/components/Gauge";
import StatCard from "@/components/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStatistics } from "@/types";
import { KJTOKCAL } from "@/utils/data";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Coffee,
  Droplet,
  LoaderCircle,
  Trophy,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect } from "react";

// Constantes
import { HEALTH_LIMITS } from "@/config/constants";
import { statsService } from "@/services/api";
import { useStatsStore } from "@/stores/statsStore";
import { toast } from "sonner";

// Seuils
const THRESHOLD_SUGAR = HEALTH_LIMITS.SUGAR_MAX; // 50g
const THRESHOLD_CAFFEINE = HEALTH_LIMITS.CAFFEINE_MAX; // 400mg
const THRESHOLD_CALORIES = HEALTH_LIMITS.CALORIES_MAX; // 2000 kcal

import { useDashboardStats } from '@/lib/hooks/useDashboard';


const Dashboard = () => {
  const { setStats, clearError } = useStatsStore();
  
  // Correction: utilisation correcte de useQuery
  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery<DashboardStatistics, Error>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await statsService.getDashboardStats();
      return response.data; // Retourne directement les données
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Correction: déplacer onSuccess dans useEffect
  useEffect(() => {
    if (data?.latestStats) {
      setStats({
        sugar: data.latestStats.totalSugar,
        caffeine: data.latestStats.totalCaffeine * 1000,
      });
    }
  }, [data, setStats]);

  // Gestion des erreurs
  useEffect(() => {
    if (error) {
      toast.error(`Erreur de chargement: ${error.message}`);
      const timer = setTimeout(() => {
        clearError();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Calculs avec valeurs par défaut
  const latestStats = data?.latestStats || {
    totalSugar: 0,
    totalCaffeine: 0,
    totalCalories: 0,
  };
  
  const caffeineInMg = latestStats.totalCaffeine * 1000;
  const caloriesInKcal = Number((latestStats.totalCalories * KJTOKCAL).toFixed(2));

  // Statut de santé
  const isSugarExceeded = latestStats.totalSugar >= THRESHOLD_SUGAR;
  const isCaffeineExceeded = caffeineInMg >= THRESHOLD_CAFFEINE;
  
  let healthStatus: "safe" | "warning" | "danger" = "safe";
  if (isSugarExceeded || isCaffeineExceeded) {
    healthStatus = "danger";
  } else if (
    latestStats.totalSugar > THRESHOLD_SUGAR * 0.8 || 
    caffeineInMg > THRESHOLD_CAFFEINE * 0.8
  ) {
    healthStatus = "warning";
  }

  // Données sécurisées
  const sugarByDay = data?.sugarByDay || [];
  const caffeineEvolution = data?.caffeineEvolution || [];
  const avgDailySugar = data?.avgDailySugar || 0;
  const avgDailyCaffeine = data?.avgDailyCaffeine || 0;
  const mostConsumedProduct = data?.mostConsumedProduct || { name: "Aucun" };
  const topSugarProduct = data?.topSugarProduct || { name: "Aucun", totalSugar: 0 };
  const alertHistory = data?.alertHistory || [];

  return (
    <div className="flex flex-col gap-6" data-testid="dashboard-page">
      {isLoading ? (
        <div className="relative" data-testid="dashboard-loading">
          <Skeleton className="h-16 w-full rounded flex items-center justify-center animate-pulse" />
          <LoaderCircle className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground opacity-40 animate-spin" />
        </div>
      ) : error ? (
        <div 
          className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          data-testid="dashboard-error"
          role="alert"
        >
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-red-800 font-semibold text-lg mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">
            Impossible de charger les données du dashboard.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            data-testid="retry-button"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <>
          {/* Status banner */}
          {healthStatus !== "safe" && (
            <div 
              className={`p-4 rounded-lg border ${
                healthStatus === "danger" 
                  ? "bg-red-50 border-red-200 text-red-800" 
                  : "bg-yellow-50 border-yellow-200 text-yellow-800"
              }`}
              data-testid="health-alert"
              role="alert"
            >
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {healthStatus === "danger" 
                    ? "⚠️ Attention : Limites dépassées" 
                    : "ℹ️ Vous approchez des limites"}
                </span>
              </div>
              <p className="mt-1 text-sm">
                {isSugarExceeded && `Sucre: ${latestStats.totalSugar}g (limite: ${THRESHOLD_SUGAR}g)`}
                {isSugarExceeded && isCaffeineExceeded && " • "}
                {isCaffeineExceeded && `Caféine: ${caffeineInMg}mg (limite: ${THRESHOLD_CAFFEINE}mg)`}
              </p>
            </div>
          )}

          {/* Gauges */}
          <div className="grid gap-6 md:grid-cols-3" data-testid="gauges-container">
            <Gauge
              label="Sugar"
              value={latestStats.totalSugar}
              max={THRESHOLD_SUGAR}
              unit="g"
              data-testid="sugar-gauge"
            />
            <Gauge
              label="Caffeine"
              value={caffeineInMg}
              max={THRESHOLD_CAFFEINE}
              unit="mg"
              data-testid="caffeine-gauge"
            />
            <Gauge
              label="Calories"
              value={caloriesInKcal}
              max={THRESHOLD_CALORIES}
              unit="kCal"
              textStyle="text-xl"
              data-testid="calories-gauge"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard
              title="Sugar by Day"
              description="Last 7 days sugar consumption"
              className="bg-transparent dark:bg-transparent border-none shadow-none"
              data-testid="sugar-chart"
            >
              {sugarByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sugarByDay}>
                    <XAxis
                      dataKey="_id"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}g`}
                    />
                    <Tooltip
                      cursor={false}
                      contentStyle={{
                        backgroundColor: "white",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value: number) => [`${value}g`, "Sucre"]}
                    />
                    <Bar
                      dataKey="totalSugar"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Aucune donnée disponible</p>
                </div>
              )}
            </ChartCard>

            <ChartCard
              title="Caffeine by Time"
              description="Today's caffeine consumption pattern"
              data-testid="caffeine-chart"
            >
              {caffeineEvolution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={caffeineEvolution}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}mg`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value: number) => [`${value}mg`, "Caféine"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulativeCaffeine"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Aucune donnée disponible</p>
                </div>
              )}
            </ChartCard>
          </div>

          {/* Stats and Alerts */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 grid gap-6 grid-cols-2">
              <StatCard
                title="Avg. Sugar / Day"
                value={`${avgDailySugar.toFixed(2)} g`}
                description="Last 30 days"
                icon={<Droplet className="h-4 w-4 text-gray-500" />}
                data-testid="avg-sugar-card"
              />
              <StatCard
                title="Avg. Caffeine / Day"
                value={`${avgDailyCaffeine.toFixed(2)} mg`}
                description="Last 30 days"
                icon={<Coffee className="h-4 w-4 text-gray-500" />}
                data-testid="avg-caffeine-card"
              />
              <StatCard
                title="Most Consumed"
                value={mostConsumedProduct.name}
                description="Last 30 days"
                icon={<Trophy className="h-4 w-4 text-gray-500" />}
                data-testid="most-consumed-card"
              />
              <StatCard
                title="Top Sugar Contributor"
                value={topSugarProduct.name}
                description="Product with most sugar"
                icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                details={
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total sugar: {topSugarProduct.totalSugar.toFixed(2)} g
                  </p>
                }
                data-testid="top-sugar-card"
              />
            </div>

            <Card data-testid="alert-history-card">
              <CardHeader>
                <CardTitle>Alert History</CardTitle>
                <CardDescription>Days you exceeded limits.</CardDescription>
              </CardHeader>
              <CardContent>
                {alertHistory.length > 0 ? (
                  <ul className="space-y-3">
                    {alertHistory.map((item, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <AlertTriangle className="h-4 w-4 mr-3 text-red-500 shrink-0" />
                        <span>{item.date}</span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {item.exceeded.join(", ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune alerte récente</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;