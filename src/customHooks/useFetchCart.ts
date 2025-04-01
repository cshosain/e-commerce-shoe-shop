import { useState, useEffect } from "react";
import axios from "axios";
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

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
          setErrorMsg("User not authenticated.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const userId = user.id;

        const response = await axios.get(
          `http://localhost:3000/api/generalUsers/cart/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCartItems(response.data.cart);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setErrorMsg("Failed to fetch cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);
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
