import { useContext, useState } from "react";
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
    const [loading, setLoading] = useState(false);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const {
        register,
        handleSubmit,
    } = useForm<LoginData>();
    const handleLogin = async (data: LoginData) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${baseUrl}/api/user/login`,
                data,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success(response.data.message);

            setIsAuthenticated(true);
            setUser(response.data.user);

            // Set sessionExpire to 7 days from now
            const sessionExpire = Date.now() + 7 * 24 * 60 * 60 * 1000;
            const userWithSession = {
                ...response.data.user,
                sessionExpire,
            };
            localStorage.setItem("user", JSON.stringify(userWithSession));
            setLoading(false);

            setTimeout(() => {
                navigateTo("/");
            }, 2000);
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            toast.error(axiosError.response?.data?.message || "Login failed");
            setLoading(false);
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
                <button disabled={loading} type="submit">Login</button>
            </form>
        </>
    );
};

export default Login;
