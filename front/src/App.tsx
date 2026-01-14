// src/App.tsx
import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy loading des pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const SearchProduct = lazy(() => import("./pages/SearchProduct"));
const AddConsumption = lazy(() => import("./pages/AddConsumption"));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchProduct />} />
          <Route path="/add-consumption" element={<AddConsumption />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;