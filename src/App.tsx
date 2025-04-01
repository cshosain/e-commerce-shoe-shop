import { QueryClient, QueryClientProvider } from "react-query";
import "./styles/App.scss";
import { ShoeProvider } from "./contexts/shoeContext";
import Home from "./pages/home/Home";
import ProtectedRoutes from "./utilities/protectedRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/product/Product";
import Cart from "./pages/cart/Cart";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Profile from "./pages/profile/Profile";
import Checkout from "./pages/checkout/Checkout";
import Error from "./pages/errors/Error";
import Success from "./pages/success/Success";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ShoeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Login />} path="/login" />
            <Route element={<Signup />} path="/signup" />
            <Route element={<Checkout />} path="/checkout" />
            <Route path="/product/:id" element={<Product />} />
            <Route path='/error?' element={<Error />} />
            <Route path='/success' element={<Success />} />

            <Route element={<ProtectedRoutes />}>
              <Route element={<Cart />} path="/cart" />
              <Route element={<Profile />} path="/profile" />
            </Route>

          </Routes>
        </BrowserRouter>
      </ShoeProvider>
    </QueryClientProvider>
  );
}

export default App;
