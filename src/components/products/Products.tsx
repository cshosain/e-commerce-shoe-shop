import { useState, useContext, useEffect } from "react";
import Card from "../card/Card";
import "./products.scss";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { ShoeContext } from "../../contexts/shoeContext";
// import Loading from "../loading/Loading";
import noItemFound from "../../assets/No Item Found.png";
import ProductsSkeleton from "../productsSkeleton/ProductsSkeleton.tsx";



type FilterCriteria = {
  brand?: string;
  category?: string;
  color?: string;
  price?: string;
  keyword?: string;
};
type Props = {
  productsRef: React.RefObject<HTMLDivElement>;
};
const Products = (props: Props) => {
  const shoeContext = useContext(ShoeContext);
  const filterCriteria: FilterCriteria = shoeContext?.filterCriteria ?? {};
  console.log("Filter Criteria:", filterCriteria);

  const fetchShoes = async ({ pageParam = 1 }) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const response = await axios.get(
      `${baseUrl}/api/shoes/paginated?limit=12&page=${pageParam}&brand=${filterCriteria.brand}&category=${filterCriteria.category}&color=${filterCriteria.color}&price=${filterCriteria.price}&keyword=${filterCriteria.keyword}`
    );
    return response.data;
  };
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(["shoesData", filterCriteria], fetchShoes, {
    // enabled: searchByEnterKey,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const productsDiv = props.productsRef.current;
    if (!productsDiv) return;

    const handleScroll = () => {
      // Infinite scroll logic
      if (
        productsDiv.scrollTop + productsDiv.clientHeight >= productsDiv.scrollHeight - 10
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
      // Show "Back to Top" button if scrolled down 300px or more
      setShowBackToTop(productsDiv.scrollTop > 300);
    };

    productsDiv.addEventListener("scroll", handleScroll);
    return () => productsDiv.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, props.productsRef]);

  const handleBackToTop = () => {
    const productsDiv = props.productsRef.current;
    if (productsDiv) {
      productsDiv.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Flatten the data from all pages
  const shoes = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) return <div><ProductsSkeleton /></div>;
  if (isError) return <p>{(error as Error)?.message ?? "An error occurred"}</p>;

  return (
    <div className="outer-products">
      <div className="products">
        {!shoes.length && !isLoading && (
          <div className="no-items">
            <img src={noItemFound} alt="No Item Found" />
          </div>
        )}
        {shoes?.map((singleShoe) => (
          <Card
            key={singleShoe._id}
            img={singleShoe.img}
            ratings={singleShoe.ratings}
            productId={singleShoe._id}
            title={singleShoe.title}
            prevPrice={singleShoe.prevPrice}
            newPrice={singleShoe.newPrice}
          />
        ))}
      </div>
      {/* {hasNextPage && (
        <button
          className="load-more-btn"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Load More" : "Loading more..."}
        </button>
      )} */}
      {isFetchingNextPage && <ProductsSkeleton />}
      {showBackToTop && (
        <button className="vertical-scroll-button" onClick={handleBackToTop}>
          <span className="arrow-icon">&#8593;</span>
          <span className="text">TO TOP</span>
        </button>
      )}
    </div>
  );
};

export default Products;
