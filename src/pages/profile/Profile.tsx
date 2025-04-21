import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
import { motion } from "framer-motion";
import useIsLoggedIn from "../../customHooks/useIsLoggedIn"; // Import the custom hook
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

// ✅ Profile Update Validation Schema (Password is optional)
const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    img: yup.string().url("Must be a valid URL"),
    password: yup
        .string()
        .trim()
        .test("isValidPassword", "Password must be at least 6 characters", (value) => {
            if (!value) return true; // If password is empty, it's valid (optional)
            return value.length >= 6; // If password is provided, it must be at least 6 characters
        }),
});



type User = {
    email: string;
    phone: number;
    firstName: string;
    lastName: string;
    img: string;
    cart: object[];
};

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false); // Toggle form
    const navigate = useNavigate();
    const isLoggedIn = useIsLoggedIn(); // Use the custom hook to check login status

    // ✅ Fetch User Data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/user/me",
                    {
                        withCredentials: true, // Ensures cookies are sent and stored
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
                if (!isLoggedIn) {
                    navigate("/login"); // Redirect to login if not logged in
                    return;
                }

            }
        };

        fetchUser();
    }, [isLoggedIn, navigate]);

    // ✅ Handle Form Submission for Profile Update
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data: object) => {
        setLoading(true);
        try {
            await axios.put("http://localhost:3000/api/user/update-profile", data, {
                withCredentials: true, // Ensures cookies are sent and stored
                headers: {
                    "Content-Type": "application/json",
                },
            });

            toast.success("Profile updated successfully!", {
                position: "top-center",
                autoClose: 3000,
            }); // Show success toast
            setTimeout(() => {
                window.location.reload(); // Reload after success
            }, 3000);
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update profile", {
                position: "top-center",
                autoClose: 3000,
            }); // Show error toast
        }
        setLoading(false);
    };

    if (!user) return <p>Loading...</p>;

    const handleLogout = async () => {
        try {
            localStorage.removeItem("user");
            setUser(null);
            await axios.get("http://localhost:3000/api/user/logout", {
                withCredentials: true,
            });
            toast.success("Logged out successfully!", {
                position: "top-center",
                autoClose: 3000,
            }); // Show success toast
            setTimeout(() => {
                window.location.reload(); // Refresh to reflect logout
            }, 3000);
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to log out", {
                position: "top-center",
                autoClose: 3000,
            }); // Show error toast
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <img src={user?.img || "/default-avatar.png"} alt="Profile" className="profile-img" />
                <h2>{user?.firstName} {user?.lastName}</h2>
                <p>Email: {user?.email}</p>
                <p>Phone: {user?.phone}</p>
                <p>Cart Items: {user?.cart.length}</p>
                <div className="btns">
                    <button onClick={() => navigate("/cart")}>Go to Cart</button>
                    <button className="update-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "Update Profile"}
                    </button>
                </div>
            </div>

            {/* ✅ Animated Profile Update Form */}
            {showForm && (
                <motion.form
                    className="profile-form"
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3>Update Profile</h3>
                    <input type="text" placeholder="First Name" {...register("firstName")} defaultValue={user.firstName} />
                    <p className="error">{errors.firstName?.message}</p>

                    <input type="text" placeholder="Last Name" {...register("lastName")} defaultValue={user.lastName} />
                    <p className="error">{errors.lastName?.message}</p>

                    <input type="text" placeholder="Profile Image URL" {...register("img")} defaultValue={user.img} />
                    <p className="error">{errors.img?.message}</p>

                    <input type="password" placeholder="New Password (optional)" {...register("password")} />
                    <p className="error">{errors.password?.message}</p>

                    <button type="submit" disabled={loading}>{loading ? "Updating..." : "Save Changes"}</button>
                </motion.form>
            )}

            {/* ✅ Always Visible Logout Button */}
            <div className="logout-section">
                <p>{user.firstName} {user.lastName}</p>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
            <ToastContainer /> {/* Add ToastContainer */}
        </div>
    );
};

export default Profile;
