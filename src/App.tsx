import { QueryClient, QueryClientProvider } from "react-query";
import "./styles/App.scss";
import { ShoeProvider } from "./contexts/shoeContext";
import Home from "./pages/home/Home";
import ProtectedRoutes from "./utilities/protectedRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/product/Product";
import Cart from "./pages/cart/Cart";
import Auth from "./pages/auth/Auth.tsx";
import OtpVerification from "./pages/otpVerification/OtpVerification.tsx";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword.tsx";
import ResetPassword from "./pages/resetPassword/ResetPassword.tsx";
import Profile from "./pages/profile/Profile";
import Checkout from "./pages/checkout/Checkout";
import Error from "./pages/errors/Error";
import Success from "./pages/success/Success";
import { ToastContainer } from "react-toastify";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import Footer from "./components/footer/Footer.tsx";
import Review from "./pages/reviews/Reviews.tsx";
import Orders from "./pages/orders/Orders.tsx";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ShoeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/otp-verification/:email/:phone"
              element={<OtpVerification />}
            />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />

            <Route element={<Checkout />} path="/checkout" />
            <Route path="/product/:id" element={<Product />} />
            <Route path='/error?' element={<Error />} />
            <Route path='/success' element={<Success />} />

            <Route element={<ProtectedRoutes />}>
              <Route element={<Cart />} path="/cart" />
              <Route element={<Profile />} path="/profile" />
              <Route element={<Orders />} path="/orders" />
            </Route>
            <Route path="/:productId/ratings-reviews" element={<Review />} />

          </Routes>
          <Footer />
          <ToastContainer theme="colored" position="top-right" autoClose={3000} />
        </BrowserRouter>
      </ShoeProvider>
    </QueryClientProvider>
  );
}

export default App;
