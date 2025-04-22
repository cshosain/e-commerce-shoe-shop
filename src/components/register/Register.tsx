import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
    const navigateTo = useNavigate();
    const {
        register,
        handleSubmit,
    } = useForm<FormData>();

    interface FormData {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        verificationMethod: "email" | "phone";
    }

    const handleRegister = async (data: FormData) => {
        data.phone = `+880${data.phone}`;
        await axios
            .post("http://localhost:3000/api/user/register", data, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            })
            .then((res) => {
                toast.success(res.data.message);
                navigateTo(`/otp-verification/${data.email}/${data.phone}`);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    return (
        <>
            <div>
                <form
                    className="auth-form"
                    onSubmit={handleSubmit((data) => handleRegister(data))}
                >
                    <h2>Register</h2>
                    <input
                        type="text"
                        placeholder="First Name"
                        required
                        {...register("firstName")}
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        required
                        {...register("lastName")}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        {...register("email")}
                    />
                    <div>
                        <span>+880</span>
                        <input
                            type="number"
                            placeholder="Phone"
                            required
                            {...register("phone")}
                        />
                    </div>
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        {...register("password")}
                    />
                    <div className="verification-method">
                        <p>Select Verification Method</p>
                        <div className="wrapper">
                            <label>
                                <input
                                    type="radio"
                                    value={"email"}
                                    {...register("verificationMethod")}
                                    required
                                />
                                Email
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value={"phone"}
                                    {...register("verificationMethod")}
                                    required
                                />
                                Phone
                            </label>
                        </div>
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    );
};

export default Register;
