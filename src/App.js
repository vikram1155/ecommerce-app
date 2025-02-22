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

function App() {
  return (
    <Box>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/protein-store" element={<ProteinStore />} />
            {/* <Route path="/calorie-tracker" element={<Calories />} />
            <Route path="/nutrition" element={<Nutrition />} /> */}
            <Route path="/supplements" element={<Supplements />} />
            <Route path="/equipments" element={<Equipments />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </Layout>
      </Router>
    </Box>
  );
}

export default App;
