import { Box } from "@mui/material";
import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
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
import { useState } from "react";
import LoginPage from "./pages/LoginPage";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const adminAccess = JSON.parse(localStorage.getItem("userinfo"));

  return (
    <Box>
      <Router>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route
                path="/login"
                element={<LoginPage setAuthenticated={setAuthenticated} />}
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
              <Route
                path="/about"
                element={
                  <Layout>
                    <About />
                  </Layout>
                }
              />
              <Route
                path="/protein-store"
                element={
                  <Layout>
                    <ProteinStore />
                  </Layout>
                }
              />
              <Route
                path="/supplements"
                element={
                  <Layout>
                    <Supplements />
                  </Layout>
                }
              />
              <Route
                path="/equipments"
                element={
                  <Layout>
                    <Equipments />
                  </Layout>
                }
              />
              <Route
                path="/protein-store/:id"
                element={
                  <Layout>
                    <ProductDetail />
                  </Layout>
                }
              />
              <Route
                path="/supplements/:id"
                element={
                  <Layout>
                    <ProductDetail />
                  </Layout>
                }
              />
              <Route
                path="/equipments/:id"
                element={
                  <Layout>
                    <ProductDetail />
                  </Layout>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <Layout>
                    <Wishlist />
                  </Layout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <Layout>
                    <Checkout />
                  </Layout>
                }
              />
              <Route
                path="/profile"
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                }
              />
              {adminAccess?.admin === true && (
                <Route
                  path="/admin"
                  element={
                    <Layout>
                      <Admin />
                    </Layout>
                  }
                />
              )}
              <Route
                path="*"
                element={
                  <Layout>
                    <Navigate to="/" replace />
                  </Layout>
                }
              />
            </>
          )}
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
