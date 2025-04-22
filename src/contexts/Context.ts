import { createContext, Dispatch, SetStateAction } from "react";

const Context = createContext<{
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  user: object | null;
  setUser: Dispatch<SetStateAction<object | null>>;
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
});
export default Context;
