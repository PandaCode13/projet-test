import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddConsumption from "./pages/AddConsumption";
import SearchProduct from "./pages/SearchProduct";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
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
  );
};

export default App;
