import Card from "../card/Card";
import "./products.scss";
import { useShoeContext } from "../../contexts/shoeContext";
const Products = () => {
  const { shoes, isLoading, isError, error } = useShoeContext();
  console.log(shoes ? shoes : "");

  return (
    <div className="products">
      {isLoading && <h1>Loading...</h1>}
      {isError && <p>{error.message}</p>}
      {shoes?.map((singleShoe) => (
        <Card key={singleShoe._id} {...singleShoe} />
      ))}
    </div>
  );
};

export default Products;
