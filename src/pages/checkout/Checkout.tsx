import { useState } from "react";
import "./checkout.scss";
import OrderSummary from "../../components/orderSummary/OrderSummery";
import PaymentOptions from "../../components/paymentOptions/PaymentOption";
import districts from "../../utilities/cities";
import axios from "axios";
import useFetchCart from "../../customHooks/useFetchCart";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const steps = ["Shipping and Gift Options", "Payment and Billing", "Review and Place Order"];
type Formdata = {
    fName: string;
    lName: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
}

const Checkout = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const { cartItems, totalPrice } = useFetchCart()
    const navigate = useNavigate()

    // Form state
    const [formData, setFormData] = useState<Formdata>({
        fName: "",
        lName: "",
        address: "",
        postalCode: "",
        city: "",
        phone: "",
    });
    console.log("form data.city: ", formData.city)

    // Handle input change dynamically
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    //shiping cost $10 per item and tax = 30% of product price.
    const shipingCost = formData.city === "dhaka" ? 0 : 1; // Free shipping in Dhaka
    const subTotal = shipingCost * cartItems.length * 10 + totalPrice + parseFloat((totalPrice * 0.3).toFixed(2));

    const nextStep = async () => {
        console.log("next step clicked")
        console.log("current step: ", currentStep)
        console.log(steps.length)
        console.log("selected method: ", selectedMethod)
        if (currentStep <= steps.length - 1) {
            if (currentStep === 1 && !selectedMethod) {
                toast.error("Please select a payment method to proceed.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }

            if (currentStep === steps.length - 1 && selectedMethod !== "bkash") {
                console.log("hello from checkout page")
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.post(
                        "http://localhost:3000/api/generalUsers/orders",
                        {
                            items: cartItems,
                            totalAmount: subTotal,
                            paymentMethod: { methodName: selectedMethod, payStatus: false },
                            shippingInformation: {
                                firstName: formData.fName,
                                lastName: formData.lName,
                                address: formData.address,
                                postalCode: formData.postalCode,
                                city: formData.city,
                                phone: formData.phone,
                                deliveryMethod: "Standard",
                                deliveryLocation: ""
                            },
                            status: "Pending",
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    toast.success("Order placed successfully!", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        onClose: () => navigate("/"), // Navigate after toast auto-closes
                    });
                    console.log(response.data);
                } catch (error) {
                    console.error("Failed to place order:", error);
                    toast.error("Failed to place order. Please try again.", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            } else if (selectedMethod === 'bkash') {
                console.log('go away to bkash payment')
                try {
                    const { data } = await axios.post('http://localhost:3000/api/bkash/payment/create', { amount: 50, orderId: 1 }, { withCredentials: true })
                    window.location.href = data.bkashURL
                } catch (error) {
                    console.log(error)
                }
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    return (
        <div className="checkout-container">
            <div className="checkout-content">
                <div className="checkout-steps">
                    {steps.map((step, index) => (
                        <div key={index} className={`step ${index === currentStep ? "active" : ""}`}>
                            <span>{index + 1}</span> {step}
                        </div>
                    ))}
                </div>

                <div className="checkout-form">
                    {currentStep === 0 && <ShippingForm formData={formData} handleChange={handleChange} />}
                    {currentStep === 1 && <PaymentOptions selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />}
                    {currentStep === 2 && <ReviewForm formData={formData} />}
                </div>

                <div className="checkout-buttons next-btn">
                    {currentStep > 0 && <button onClick={prevStep}>Back</button>}
                    <button onClick={nextStep}>
                        {currentStep === steps.length - 1 && selectedMethod !== "bkash" ? "Place Order" : "Next"}
                    </button>
                </div>
            </div>

            {/* No shiping charge in Dhaka city*/}
            <OrderSummary shipingCost={shipingCost} />
            <ToastContainer />
        </div>
    );
};

// Shipping Form Component
const ShippingForm = ({ formData, handleChange }: { formData: Formdata; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void }) => (
    <div className="checkout-form">
        <h2>Ship To</h2>
        <div className="postalcode">
            <div>
                <label htmlFor="fName">First Name <span>required</span></label>
                <input type="text" name="fName" value={formData.fName} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="lName">Last Name <span>required</span></label>
                <input type="text" name="lName" value={formData.lName} onChange={handleChange} />
            </div>
        </div>
        <label htmlFor="address">Address <span>required</span></label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
        <div className="postalcode">
            <div>
                <label htmlFor="postalCode">Postal Code <span>required</span></label>
                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="city">City/Town <span>required</span></label>
                {/* <input type="text" name="city" value={formData.city} onChange={handleChange} /> */}
                <select name="city" value={formData.city} onChange={handleChange} >
                    {districts.map((district) => (
                        <option key={district} value={district.toLowerCase()}>{district.toUpperCase()}</option>
                    ))}
                </select>
            </div>
        </div>
        <label htmlFor="phone">Phone Number <span>required</span></label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
    </div>
);

// Review Form Component
const ReviewForm = ({ formData }: { formData: Formdata }) => (
    <div className="checkout-form">
        <h2>Review Order</h2>
        <p>Confirm your details before placing the order.</p>
        <ul>
            <li><strong>First Name:</strong> {formData.fName}</li>
            <li><strong>Last Name:</strong> {formData.lName}</li>
            <li><strong>Address:</strong> {formData.address}</li>
            <li><strong>Postal Code:</strong> {formData.postalCode}</li>
            <li><strong>City:</strong> {formData.city}</li>
            <li><strong>Phone:</strong> {formData.phone}</li>
        </ul>
    </div>
);

export default Checkout;
