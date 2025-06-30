import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "./product.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import renderStars from "../../utilities/renderStars.tsx";
import useIsLoggedIn from "../../customHooks/useIsLoggedIn.ts";
// import Loading from "../../components/loading/Loading.tsx";
import ProductSkeleton from "../../components/productSkelenton/ProductSkelenton.tsx";

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
  description: string;
  ratings: { averageRating: number; noOfRatings: number; ratingsBreakdown: { star: number; count: number }[]; averageCategoryRatings: { [key: string]: number } };
  reviews: { _id: string; userName: string; userImg: string; rating: number; comment: string; images?: string[]; createdAt: string }[];
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
  const navigate = useNavigate(); // Will be use to redirect user if not logged in
  const isLoggedIn = useIsLoggedIn(); // Use the custom hook to check login status
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Track the selected image
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  //default image for testing
  const defaultImage = "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2430c836-4346-46ce-9691-7d1480d3683e/AIR+MAX+DN8+%28GS%29.png";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/shoes/${id}`);
        const data = response.data;
        setProduct(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchData();
  }, [id, baseUrl, isLoggedIn]);


  const handleAddToCart = async () => {
    // ✅ Check if user is logged in using local storage
    // const user = localStorage.getItem("user");
    if (!isLoggedIn) {
      toast.error("Please log in to add items to the cart.", {
        position: "top-center",
        autoClose: 4000,
      });
      navigate("/auth"); // Redirect user to login page
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
        `${baseUrl}/api/user/cart/add`,
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
        toast.success(response.data.message || "Item added to cart!", {
          position: "top-center",
          autoClose: 4000,
        });
        setIsAddedToCart(true); // Mark as added to cart
        setLoading(false);
      } else {
        console.log(response.data.message);
        toast.error(response.data.message || "Error adding to cart", {
          position: "top-center",
          autoClose: 4000,
        });
        setLoading(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        toast.error(error.response?.data.message || "Something went wrong while adding to the cart.", {
          position: "top-center",
          autoClose: 4000,
        });
      } else {
        console.log(error);
        toast.error("Something went wrong while adding to the cart.", {
          position: "top-center",
          autoClose: 4000,
        });
      }
      setLoading(false);
    }
  };

  const handleGoToCart = () => {
    navigate("/cart"); // Navigate to the cart page
  };

  if (!product) return <ProductSkeleton />; // Show loading state if product is not fetched yet

  return (
    <div className="product-page">
      <button className="back-button" onClick={() => window.history.back()}>
        <FaArrowLeft /> Back
      </button>

      <div className="product-container">
        <div className="product-image">
          <img className="main-image" src={selectedImage || product.img} alt={product.title} />
          <div className="product-other-images">
            {product.images.map((image, index) => (
              <img key={index} src={image || defaultImage} onMouseEnter={() => setSelectedImage(image)} className={selectedImage === image || (selectedImage === null && index === 0) ? "selected-image" : ""} alt={`Product Image ${index + 1}`} />
            ))}
          </div>
        </div>

        <div className="product-details">
          <h1>{product.title}</h1>
          <div className="rating">
            {renderStars(product.ratings?.averageRating)} ({product.ratings?.noOfRatings} reviews)
          </div>
          <p className="description">{product.description}</p>

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
          <div className="size-info">
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
          </div>

          <div className="price">${product.newPrice}</div>
          <button
            className="add-to-cart"
            onClick={isAddedToCart ? handleGoToCart : handleAddToCart}
            disabled={loading}
          >
            {isAddedToCart ? "Go to Cart" : "Add to Cart"}
          </button>
          {/* {product reviews dropdown section }  */}
          <div className="reviews-section">
            <h3><div className="rating">
              {renderStars(product.ratings?.averageRating)} <span>({product.reviews?.length} reviews)</span>
            </div></h3>
            {product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review._id} className="review">
                  <div className="review-header">
                    <p className="review-user">{review.userName}</p>
                    <div className="review-rating">{renderStars(review.rating)}</div>
                    <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
            {product.reviews.length > 0 && <button id="showMoreBtn" onClick={() => navigate(`/${product._id}/ratings-reviews`)}>Show More</button>}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Product;
