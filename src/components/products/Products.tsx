import Card from "../card/Card";
import "./products.scss";
import { useShoeContext } from "../../contexts/shoeContext";

type Prop = {
  displayMenu: boolean;
};
const Products = ({ displayMenu }: Prop) => {
  const { shoes, isLoading, isError, error } = useShoeContext();
  console.log(shoes ? shoes : "");

  return (
    <div
      className={
        displayMenu
          ? "outer-products outer-products-invisible"
          : "outer-products"
      }
    >
      <div className={displayMenu ? "products products-invisible" : "products"}>
        {isLoading && <h1>Loading...</h1>}
        {isError && <p>{error.message}</p>}
        {!shoes.length && !isLoading ? <p>No Item Found!</p> : ""}
        {shoes?.map((singleShoe) => (
          <Card key={singleShoe._id} {...singleShoe} />
        ))}
      </div>
    </div>
  );
};

export default Products;
