import axios from "axios";
import "./cart.scss";
import { useNavigate } from "react-router-dom";
import useFetchCart from "../../customHooks/useFetchCart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
    const navigate = useNavigate();

    const { cartItems, setCartItems, loading, totalPrice } = useFetchCart();

    const updateQuantity = async (cartId: string, quantity: number) => {
        try {
            const token = localStorage.getItem("token");
            const userString = localStorage.getItem("user");

            if (!token || !userString) return;

            const user = JSON.parse(userString);
            const userId = user.id; // Get user ID

            await axios.put(
                `http://localhost:3000/api/generalUsers/cart/update/${userId}`,
                { cartId, quantity }, // Send userId along with cart item id and quantity
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCartItems((prev) =>
                prev.map((item) =>
                    item._id === cartId ? { ...item, quantity: quantity } : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeItem = async (cartId: string) => {
        try {
            const token = localStorage.getItem("token");
            const userString = localStorage.getItem("user");

            if (!token || !userString) return;

            const user = JSON.parse(userString);
            const userId = user.id; // Get user ID

            const response = await axios.delete(`http://localhost:3000/api/generalUsers/cart/remove/${userId}/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                toast.success("Item removed from cart!", {
                    position: "top-center",
                    autoClose: 4000,
                });
                setCartItems((prev) => prev.filter((item) => item._id !== cartId));
            } else {
                toast.error("Error removing item from cart.", {
                    position: "top-center",
                    autoClose: 4000,
                });
            }
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Something went wrong while removing the item.", {
                position: "top-center",
                autoClose: 4000,
            });
        }
    };

    if (!loading) {
        console.log(cartItems);
    } else console.log("loading...");

    return (
        loading ? <div> Loading....</div> : <div >
            <h1 className="main-heading">YOUR CART</h1>
            <div className="cart-page">
                {cartItems?.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <button onClick={() => navigate("/")} className="continue-shopping">Continue Shopping</button>
                    </div>
                ) : (
                    <div className="cart-items">
                        {cartItems?.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <img src={item.img} alt={item.title} />
                                <div className="details">
                                    <h3>{item.title}</h3>
                                    <p>Size: {item.size} | Color: {item.color}</p>
                                    <p>Price: ${item.price}</p>
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="remove" onClick={() => removeItem(item._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {cartItems?.length > 0 && (
                    <div className="order-summary">
                        <h2>Total: ${totalPrice.toFixed(2)}</h2>
                        <button onClick={() => navigate("/checkout")} className="checkout">Proceed to Checkout</button>
                    </div>
                )}
                <ToastContainer />
            </div>
        </div>
    );
};

export default Cart;
