import "./categories.scss";
import { AiOutlineShoppingCart } from "react-icons/ai";
import MultipleChoice from "./multipleChoice/MultipleChoice";

const Categories = () => {
  return (
    <div className="all-categories">
      <section className="logo-section">
        <h1>
          <AiOutlineShoppingCart />
        </h1>
      </section>
      <MultipleChoice
        question="Category"
        options={["All", "Sneakers", "Flats", "Sandals", "Heels"]}
      />
      <MultipleChoice
        question="Price"
        options={["All", "$0 - 50", "$51 - 100", "$101 - 150", "$151 - Above"]}
      />
      <MultipleChoice
        question="Color"
        options={["All", "Red", "Green", "Blue", "Orange", "white"]}
      />
    </div>
  );
};

export default Categories;
