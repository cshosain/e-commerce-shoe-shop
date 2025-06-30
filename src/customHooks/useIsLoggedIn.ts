import { useEffect, useState } from "react";
import axios from "axios";

const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    //check if user is authenticated by http://localhost:3000/api/user/auth/check using  axios
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/user/auth/check`, {
          withCredentials: true, // Ensure cookies are sent with the request
          headers: {
            "Content-Type": "application/json",
          },
        });
        setIsLoggedIn(response.data.success);
        console.log("Authentication check response:", response.data);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuthentication();
  }, [setIsLoggedIn, baseUrl]);
  return isLoggedIn;
};

export default useIsLoggedIn;
