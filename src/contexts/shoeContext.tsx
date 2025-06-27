/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  ReactNode,
  useState,
} from "react";

type FilterCriteria = {
  brand: string;
  price: string;
  category: string;
  color: string;
  keyword: string;
};
type ShoeContext = {
  filterCriteria: FilterCriteria;
  setFilteredCriteria: React.Dispatch<React.SetStateAction<FilterCriteria>>;
};

// Create the context with default values
const ShoeContext = createContext<ShoeContext | undefined>(undefined);

// Define the provider props type to include children
type ShoeProviderProps = {
  children: ReactNode;
};
// Provider component
export const ShoeProvider: React.FC<ShoeProviderProps> = ({ children }) => {

  const [filterCriteria, setFilteredCriteria] = useState<FilterCriteria>({
    brand: "All",
    price: "All",
    category: "All",
    color: "All",
    keyword: "",
  });

  return (
    <ShoeContext.Provider
      value={{
        filterCriteria,
        setFilteredCriteria,
      }}
    >
      {children}
    </ShoeContext.Provider>
  );
};

export { ShoeContext };