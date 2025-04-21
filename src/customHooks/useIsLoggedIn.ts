import { useEffect, useState } from "react";
import axios from "axios";

const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/user/me", {
          withCredentials: true,
        });
        if (data.success) {
          setIsLoggedIn(true);
          // localStorage.setItem("user", JSON.stringify(data.user)); // Store user data in local storage
          console.log("User is logged in:", data.user); // Log user data
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false); // Not logged in or error
        if (axios.isAxiosError(error) && error.response) {
          console.log(error.response.data.message); // Log error message
        } else {
          console.log("An unknown error occurred:", error); // Handle unknown errors
        }
      }
    };

    if (localStorage.getItem("user")) {
      setIsLoggedIn(true); // User is logged in
    } else {
      checkLoginStatus(); // Check login status from server
    }
  }, []);

  return isLoggedIn;
};

export default useIsLoggedIn;
