import { useEffect, useState } from "react";
import axios from "axios";

const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    //check if user is authenticated by http://localhost:3000/api/user/auth/check using  axios
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/auth/check",
          {
            withCredentials: true, // Ensure cookies are sent with the request
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setIsLoggedIn(response.data.success);
        console.log("Authentication check response:", response.data.success);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuthentication();
  }, [setIsLoggedIn]);
  return isLoggedIn;
};

export default useIsLoggedIn;
