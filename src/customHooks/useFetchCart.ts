import { useState, useEffect } from "react";
import axios from "axios";
// import useIsLoggedIn from "./useIsLoggedIn.ts"; // Import the custom hook
// import { useNavigate } from "react-router-dom";
// Define types for cart items
type CartItem = {
  _id: string;
  productId: string;
  title: string;
  img: string;
  price: number;
  size: number;
  color: string;
  quantity: number;
};

const useFetchCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  //const isLoggedIn = useIsLoggedIn(); // Use the custom hook to check login status
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      // if (!isLoggedIn) {
      //   setErrorMsg("User not authenticated.");
      //   setLoading(false);
      //   return; // Redirect to login if not authenticated
      // }

      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/user/cart`, {
          withCredentials: true,
        });

        setCartItems(response.data.cart);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setErrorMsg("Failed to fetch cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [baseUrl]); // Re-run if login status changes

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  return {
    cartItems,
    errorMsg,
    loading,
    setCartItems,
    setLoading,
    totalPrice,
  };
};

export default useFetchCart;
