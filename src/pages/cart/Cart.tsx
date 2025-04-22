import { useState, useEffect } from "react";
import axios from "axios";
import "./cart.scss";
import { useNavigate } from "react-router-dom";
import useFetchCart from "../../customHooks/useFetchCart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ToastPosition } from "react-toastify";

const toastConfig = {
    position: "top-center" as ToastPosition,
    autoClose: 4000,
};

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, setCartItems, loading, totalPrice } = useFetchCart();
    const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [debounceTimers, setDebounceTimers] = useState<{ [key: string]: ReturnType<typeof setTimeout> }>({});

    // Initialize quantities state after cartItems are fetched
    useEffect(() => {
        const initialQuantities = cartItems.reduce((acc, item) => {
            acc[item._id] = item.quantity; // Initialize quantities with cart item quantities
            return acc;
        }, {} as { [key: string]: number });
        setQuantities(initialQuantities);
    }, [cartItems]);

    const user = localStorage.getItem("user");
    if (!user) {
        toast.error("Please login to view your cart");
        setTimeout(() => {
            navigate("/auth");
        }, 4000);
    }
    const handleQuantityChange = (cartId: string, newQuantity: number) => {
        // Update the local state instantly
        setQuantities((prev) => ({
            ...prev,
            [cartId]: newQuantity,
        }));

        // Clear any existing timer for this cart item
        if (debounceTimers[cartId]) {
            clearTimeout(debounceTimers[cartId]);
        }

        // Set a new timer for the API call
        const timer = setTimeout(() => {
            // Call the debounced API update function
            saveUpdatedQuantityToDB(cartId, newQuantity);
        }, 500); // Delay of 500ms

        // Save the timer in the state
        setDebounceTimers((prev) => ({
            ...prev,
            [cartId]: timer,
        }));

        // Set the loading state for the specific item
        setLoadingItemId(cartId);
    };

    const saveUpdatedQuantityToDB = async (cartId: string, quantity: number) => {
        try {
            await axios.put(
                `http://localhost:3000/api/user/cart/update`,
                { cartId, quantity },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Update the cartItems state to reflect the server's response
            setCartItems((prev) =>
                prev.map((item) =>
                    item._id === cartId ? { ...item, quantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("Failed to update quantity", toastConfig);
        } finally {
            setLoadingItemId(null);
        }
    };

    const removeItem = async (cartId: string) => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/user/cart/remove/${cartId}`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                toast.success("Item removed from cart!", toastConfig);
                setCartItems((prev) => prev.filter((item) => item._id !== cartId));
                setQuantities((prev) => {
                    const updatedQuantities = { ...prev };
                    delete updatedQuantities[cartId];
                    return updatedQuantities;
                });
            } else {
                toast.error("Error removing item from cart.", toastConfig);
            }
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Something went wrong while removing the item.", toastConfig);
        }
    };

    return loading ? (
        <div>Loading...</div>
    ) : (
        <div>
            <h1 className="main-heading">YOUR CART</h1>
            <div className="cart-page">
                {cartItems?.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <button
                            onClick={() => navigate("/")}
                            className="continue-shopping"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <img src={item.img} alt={item.title} />
                                <div className="details">
                                    <h3>{item.title}</h3>
                                    <p>
                                        Size: {item.size} | Color: {item.color}
                                    </p>
                                    <p>Price: ${item.price}</p>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(item._id, quantities[item._id] - 1)
                                            }
                                            disabled={quantities[item._id] <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{quantities[item._id]}</span>
                                        <button
                                            onClick={() =>
                                                handleQuantityChange(item._id, quantities[item._id] + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="remove"
                                        onClick={() => removeItem(item._id)}
                                        disabled={loadingItemId === item._id}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {cartItems?.length > 0 && (
                    <div className="order-summary">
                        <h2>Total: ${totalPrice.toFixed(2)}</h2>
                        <button
                            onClick={() => navigate("/checkout")}
                            className="checkout"
                            disabled={loading}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
                <ToastContainer />
            </div>
        </div>
    );
};

export default Cart;
