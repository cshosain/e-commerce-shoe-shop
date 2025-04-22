import { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Context from "../../contexts/Context.js";
type LoginData = {
    email: string;
    password: string;
};

const Login = () => {
    const { setIsAuthenticated, setUser } = useContext(Context);
    const navigateTo = useNavigate();

    const {
        register,
        handleSubmit,
    } = useForm<LoginData>();
    const handleLogin = async (data: LoginData) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/user/login",
                data,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success(response.data.message); // Show success toast
            setIsAuthenticated(true); // Update authentication state
            setUser(response.data.user); // Update user state
            localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data in localStorage

            // Redirect to home page after 2 seconds
            setTimeout(() => {
                navigateTo("/");
            }, 2000);
        } catch (error: any) {
            // Handle errors and show error toast
            toast.error(error.response?.data?.message || "Login failed");
        }
    };
    return (
        <>
            <form
                className="auth-form"
                onSubmit={handleSubmit((data) => handleLogin(data))}
            >
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    {...register("email")}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    {...register("password")}
                />
                <p className="forgot-password">
                    <Link to={"/password/forgot"}>Forgot your password?</Link>
                </p>
                <button type="submit">Login</button>
            </form>
        </>
    );
};

export default Login;
