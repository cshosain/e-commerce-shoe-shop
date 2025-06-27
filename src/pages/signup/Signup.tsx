import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.scss";

// ✅ Define form validation schema using Yup
const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
        .string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
    img: yup.string().url("Must be a valid URL").required("Image URL is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: object) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/api/user/signup`, data);
            if (response.data.success) {
                alert("Signup successful!");
                navigate("/login"); // Redirect to login page after signup
            } else {
                alert("Signup failed");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Something went wrong");
        }
        setLoading(false);
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                <h2>Sign Up</h2>

                <input type="text" placeholder="First Name" {...register("firstName")} />
                <p className="error">{errors.firstName?.message}</p>

                <input type="text" placeholder="Last Name" {...register("lastName")} />
                <p className="error">{errors.lastName?.message}</p>

                <input type="email" placeholder="Email" {...register("email")} />
                <p className="error">{errors.email?.message}</p>

                <input type="text" placeholder="Phone Number" {...register("phone")} />
                <p className="error">{errors.phone?.message}</p>

                <input type="text" placeholder="Profile Image URL" {...register("img")} />
                <p className="error">{errors.img?.message}</p>

                <input type="password" placeholder="Password" {...register("password")} />
                <p className="error">{errors.password?.message}</p>

                <button type="submit" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default Signup;
