import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import useIsLoggedIn from "../../customHooks/useIsLoggedIn.ts";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const Login = () => {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/user/login",
        { email, password },
        {
          withCredentials: true, // VERY IMPORTANT for sending/receiving cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000,
        }); // Show success toast
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
        //after 2s redirect to home page
        setTimeout(() => {
          navigate("/"); // Redirect to home page
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed", {
        position: "top-center",
        autoClose: 3000,
      }); // Show error toast
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <ToastContainer /> {/* Add ToastContainer */}
    </div>
  );
};

export default Login;