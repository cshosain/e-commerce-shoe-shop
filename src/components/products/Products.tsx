import Card from "../card/Card";
import "./products.scss";
import { useShoeContext } from "../../customHooks/useShoeContext.ts";

const Products = () => {
  const { shoes, isLoading, isError, error } = useShoeContext();
  console.log(shoes)
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <p>{error.message}</p>
  }
  if (!shoes.length && !isLoading) {
    return <p>No Item Found!</p>
  }

  return (
    <div
      className={"outer-products"
      }
    >
      <div className={"products"}>
        {shoes?.map((singleShoe) => (
          <Card key={singleShoe._id} img={singleShoe.img} ratings={singleShoe.ratings} productId={singleShoe._id} title={singleShoe.title} prevPrice={singleShoe.prevPrice} newPrice={singleShoe.newPrice} />
        ))}
      </div>
    </div>
  );
};

export default Products;
