import { useState } from "react";
import "./forgotPassword.scss";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios
            .post(
                `${baseUrl}/api/user/password/forgot`,
                { email },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    return (
        <>
            <div className="forgot-password-page">
                <div className="forgot-password-container">
                    <h2>Forgot Password</h2>
                    <p>Enter your email address to receive a password reset token.</p>
                    <form
                        onSubmit={handleForgotPassword}
                        className="forgot-password-form"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="forgot-input"
                        />
                        <button type="submit" className="forgot-btn">
                            Send Reset Link
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
