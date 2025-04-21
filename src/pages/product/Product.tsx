import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "./product.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useIsLoggedIn from "../../customHooks/useIsLoggedIn.ts"; // Import the custom hook

type Product = {
  _id: string;
  availableColors: string[];
  availableSizes: number[];
  barnd: string;
  category: string;
  createdAt: string;
  discount: number;
  images: string[];
  isFeatured: boolean;
  img: string;
  title: string;
  ratings: { average: number; total: number };
  reviews: {
    user: string;
    comment: string;
    rating: number;
    _id: string;
    createdAt: string;
  }[];
  prevPrice: number;
  newPrice: number;
  stock: number;
  updatedAt: string;
  __v: number;
};

const Product = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false); // Track if the item is added to the cart
  const navigate = useNavigate(); // To redirect user if not logged in
  const isLoggedIn = useIsLoggedIn(); // Use the custom hook to check login status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/shoes/${id}`);
        const data = response.data;
        setProduct(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchData();
  }, [id]);

  const renderStars = (average: number) => {
    const fullStars = Math.floor(average); // Number of full stars
    const hasHalfStar = average % 1 >= 0.5; // Check if there's a half star
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={`full-${i}`} className="star full">
              ★
            </span>
          ))}
        {hasHalfStar && <span className="star half">☆</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <span key={`empty-${i}`} className="star empty">
              ☆
            </span>
          ))}
      </>
    );
  };

  const handleAddToCart = async () => {
    // ✅ Check if user is logged in using the custom hook
    if (!isLoggedIn) {
      toast.error("Please log in to add items to the cart.", {
        position: "top-center",
        autoClose: 4000,
      });
      navigate("/login"); // Redirect user to login page
      return;
    }

    // ✅ Check if user selected size & color
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color.", {
        position: "top-center",
        autoClose: 4000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/user/cart/add",
        {
          productId: product?._id,
          size: selectedSize,
          color: selectedColor,
        },
        {
          withCredentials: true, // Ensures cookies are sent and stored
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Item added to cart!", {
          position: "top-center",
          autoClose: 4000,
        });
        setIsAddedToCart(true); // Mark as added to cart
        setLoading(false);
      } else {
        toast.error("Error adding to cart", {
          position: "top-center",
          autoClose: 4000,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong while adding to the cart.", {
        position: "top-center",
        autoClose: 4000,
      });
      setLoading(false);
    }
  };

  const handleGoToCart = () => {
    navigate("/cart"); // Navigate to the cart page
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-page">
      <button className="back-button" onClick={() => window.history.back()}>
        <FaArrowLeft /> Back
      </button>

      <div className="product-container">
        <div className="product-image">
          <img src={product.img} alt={product.title} />
        </div>

        <div className="product-details">
          <h1>{product.title}</h1>
          <div className="rating">
            {renderStars(product.ratings?.average)} ({product.reviews?.length} reviews)
          </div>
          <p className="description">{product.title}</p>

          {/* Color Selection */}
          <div className="color-section">
            <div className="color-heading">
              <h3>Color</h3>
            </div>

            <div className="color-options">
              {product?.availableColors.map((clr) => (
                <button
                  key={clr}
                  className={`color ${clr} ${selectedColor === clr ? "selected" : ""}`}
                  onClick={() => setSelectedColor(clr)}
                ></button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="size-heading">
            <h3>Size</h3>
          </div>
          <div className="size-options">
            {product.availableSizes.map((size) => (
              <button
                key={size}
                className={`size ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="price">${product.newPrice}</div>
          <button
            className="add-to-cart"
            onClick={isAddedToCart ? handleGoToCart : handleAddToCart}
            disabled={loading}
          >
            {isAddedToCart ? "Go to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Product;
