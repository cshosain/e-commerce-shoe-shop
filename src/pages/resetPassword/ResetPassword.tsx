import { useContext, useState } from "react";
import "./resetPassword.scss";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Context from "../../contexts/Context";

const ResetPassword = () => {
    const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await axios
            .put(
                `${baseUrl}/api/user/password/reset/${token}`,
                { password, confirmPassword },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                toast.success(res.data.message);
                setIsAuthenticated(true);
                setUser(res.data.user);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    if (isAuthenticated) {
        return <Navigate to={"/"} />;
    }

    return (
        <>
            <div className="reset-password-page">
                <div className="reset-password-container">
                    <h2>Reset Password</h2>
                    <p>Enter your new password below.</p>
                    <form className="reset-password-form" onSubmit={handleResetPassword}>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="reset-input"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="reset-input"
                        />
                        <button type="submit" className="reset-btn">
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
