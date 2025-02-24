import { Box } from "@mui/material";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./pages/About";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Supplements from "./pages/Supplements";
import ProteinStore from "./pages/ProteinStore";
import Equipments from "./pages/Equipments";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";

function App() {
  return (
    <Box>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/protein-store" element={<ProteinStore />} />
            <Route path="/supplements" element={<Supplements />} />
            <Route path="/equipments" element={<Equipments />} />
            <Route path="/protein-store/:id" element={<ProductDetail />} />
            <Route path="/supplements/:id" element={<ProductDetail />} />
            <Route path="/equipments/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </Layout>
      </Router>
    </Box>
  );
}

export default App;
