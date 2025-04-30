/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";

// Define the shape of the context data
type ShoeContextType = {
  filteredCriteria: object;
  setFilteredCriteria: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  shoes: {
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
    ratings: { average: number, total: number };
    reviews: { user: string, comment: string, rating: number, _id: string, createdAt: string }[];
    prevPrice: number;
    newPrice: number;
    stock: number;
    updatedAt: string;
    __v: number;
  }[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
};

// Create the context with default values
const ShoeContext = createContext<ShoeContextType | undefined>(undefined);

// Define the provider props type to include children
type ShoeProviderProps = {
  children: ReactNode;
};
//type for filtredCriteria and setter
type FilterCriteria = {
  brand: string;
  price: string;
  category: string;
  color: string;
  keyword: string;
};

// Provider component
export const ShoeProvider: React.FC<ShoeProviderProps> = ({ children }) => {

  const [filteredCriteria, setFilteredCriteria] = useState<FilterCriteria>({
    brand: "All",
    price: "All",
    category: "All",
    color: "All",
    keyword: "",
  });

  // Fetching function for infinite query
  const fetchShoes = async ({ pageParam = 1 }) => {
    const response = await axios.get(
      `http://localhost:3000/api/shoes/paginated?limit=10&page=${pageParam}&brand=${filteredCriteria.brand}&category=${filteredCriteria.category}&color=${filteredCriteria.color}&price=${filteredCriteria.price}&keyword=${filteredCriteria.keyword}`,
      {
        headers: {
          token: "Bearer my token",
        },
      }
    );
    return response.data;
  };

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery(["shoesData", filteredCriteria], fetchShoes, {
      getNextPageParam: (lastPage, allPages) => {
        // Assuming the API provides a `hasMore` property in response
        return lastPage.hasMore ? allPages.length + 1 : undefined;
      },
    });

  // Handle infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >
        document.documentElement.scrollHeight
      ) {
        if (hasNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, fetchNextPage]);

  return (
    <ShoeContext.Provider
      value={{
        shoes: data?.pages.flatMap((page) => page.data) || [],
        // shoes: Dummydata,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        filteredCriteria,
        setFilteredCriteria,
      }}
    >
      {children}
    </ShoeContext.Provider>
  );
};

export { ShoeContext };