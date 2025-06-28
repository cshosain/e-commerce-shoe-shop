import { useContext, useEffect } from "react";
import Card from "../card/Card";
import "./products.scss";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { ShoeContext } from "../../contexts/shoeContext";



type FilterCriteria = {
  brand?: string;
  category?: string;
  color?: string;
  price?: string;
  keyword?: string;
};

const Products = () => {
  const shoeContext = useContext(ShoeContext);
  const filterCriteria: FilterCriteria = shoeContext?.filterCriteria ?? {};
  console.log("Filter Criteria:", filterCriteria);

  const fetchShoes = async ({ pageParam = 1 }) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const response = await axios.get(
      `${baseUrl}/api/shoes/paginated?limit=10&page=${pageParam}&brand=${filterCriteria.brand}&category=${filterCriteria.category}&color=${filterCriteria.color}&price=${filterCriteria.price}&keyword=${filterCriteria.keyword}`
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

  // Optional: Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the data from all pages
  const shoes = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <p>{(error as Error)?.message ?? "An error occurred"}</p>;
  if (!shoes.length) return <p>No Item Found!</p>;

  return (
    <div className="outer-products">
      <div className="products">
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
      {hasNextPage && (
        <button
          className="load-more-btn"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default Products;
