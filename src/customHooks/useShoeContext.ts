import { useContext } from "react";
import { ShoeContext } from "../contexts/shoeContext";

// Custom hook to use the ShoeContext
export const useShoeContext = () => {
  const context = useContext(ShoeContext);
  if (context === undefined) {
    throw new Error("useShoeContext must be used within a ShoeProvider");
  }
  return context;
};
