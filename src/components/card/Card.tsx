import { IoBagCheck } from "react-icons/io5";
import "./card.scss";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

type Props = {
  productId: string;
  img: string;
  title: string;
  ratings: { averageRating: number, noOfRatings: number };
  prevPrice: number;
  newPrice: number;
};

const Card = ({ productId, img, title, ratings, prevPrice, newPrice }: Props) => {
  const navigate = useNavigate(); // ✅ Initialize navigate function

  const stars = Math.round(ratings.averageRating);
  const x = [];
  for (let i = 0; i < stars; i++) {
    x.push(i);
  }

  // ✅ Navigate to product details page when image is clicked
  const handleProductClick = () => {
    navigate(`/product/${productId}`); // Redirect to the product details page
  };

  return (
    <section className="card">
      {/* ✅ Click event navigates to the product details page */}
      <img onClick={handleProductClick} loading="lazy" src={img} alt={title} className="card-img" />
      <div className="card-details">
        <h3 className="card-title">{title}</h3>
        <section className="card-reviews">
          {x.map((i) => (
            <AiFillStar key={i} className="rating-star" />
          ))}
          <span className="total-reviews">({ratings.averageRating ? ratings.averageRating : "No reviews"})</span>
        </section>
        <section className="card-price">
          <div className="price">
            <del>${prevPrice}</del> ${newPrice}
          </div>
          <div className="bag">
            <IoBagCheck className="bag-icon" />
          </div>
        </section>
      </div>
    </section>
  );
};

export default Card;
