/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";

// Define the shape of the context data
type ShoeContextType = {
  shoes: {
    _id: string;
    img: string;
    title: string;
    star: string;
    reviews: string;
    prevPrice: string;
    newPrice: string;
  }[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
};

// Create the context with default values
const ShoeContext = createContext<ShoeContextType | undefined>(undefined);

// Fetching function for infinite query
const fetchShoes = async ({ pageParam = 1 }) => {
  const response = await axios.get(
    `http://localhost:3000/api/shoes/paginated?limit=10&page=${pageParam}`
  );
  return response.data;
};

// Define the provider props type to include children
type ShoeProviderProps = {
  children: ReactNode;
};

// Provider component
export const ShoeProvider: React.FC<ShoeProviderProps> = ({ children }) => {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery("shoesData", fetchShoes, {
      getNextPageParam: (lastPage, allPages) => {
        console.log(lastPage);
        console.log(allPages);
        // Assuming the API provides a `hasMore` property in response
        return lastPage.hasMore ? allPages.length + 1 : undefined;
      },
    });

  console.log(data);
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
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
      }}
    >
      {children}
    </ShoeContext.Provider>
  );
};

// Custom hook to use the ShoeContext
export const useShoeContext = () => {
  const context = useContext(ShoeContext);
  if (context === undefined) {
    throw new Error("useShoeContext must be used within a ShoeProvider");
  }
  return context;
};
