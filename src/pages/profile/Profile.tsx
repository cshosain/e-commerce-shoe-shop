import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
import { motion } from "framer-motion";

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

    // ✅ Fetch User Data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate("/login");

                const response = await axios.get(
                    "http://localhost:3000/api/generalUsers/profile",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [navigate]);

    // ✅ Handle Form Submission for Profile Update
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data: object) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:3000/api/generalUsers/update-profile", data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Profile updated successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update profile");
        }
        setLoading(false);
    };

    if (!user) return <p>Loading...</p>;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload(); // Refresh to reflect logout
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <img src={user.img || "/default-avatar.png"} alt="Profile" className="profile-img" />
                <h2>{user.firstName} {user.lastName}</h2>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Cart Items: {user.cart.length}</p>
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
        </div>
    );
};

export default Profile;
