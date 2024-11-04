import { IoBagCheck } from "react-icons/io5";
import "./card.scss";
import { AiFillStar } from "react-icons/ai";

type Props = {
  _id: string;
  img: string;
  title: string;
  // star: React.ReactNode;
  star: string;
  reviews: string;
  prevPrice: string;
  newPrice: string;
};

const Card = ({
  _id,
  img,
  title,
  star,
  reviews,
  prevPrice,
  newPrice,
}: Props) => {
  const x = [];
  for (let i = 0; i < parseInt(star); i++) {
    x.push(i);
  }

  return (
    <>
      <section className="card">
        <img loading="lazy" src={img} alt={title} className="card-img" />
        <div className="card-details">
          <h3 className="card-title">{title}</h3>
          <section className="card-reviews">
            {x.map((i) => (
              <AiFillStar key={i} className="rating-star" />
            ))}
            <span className="total-reviews">{reviews}</span>
          </section>
          <section className="card-price">
            <div className="price">
              <del>{prevPrice}</del> {newPrice}
            </div>
            <div className="bag">
              <IoBagCheck className="bag-icon" />
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default Card;
