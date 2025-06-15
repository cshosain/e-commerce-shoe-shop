import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./error.scss";

const Error = () => {
    const searchData = new URLSearchParams(window.location.search);
    const message = searchData.get("message");
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            navigate("/checkout");
        }, 10000);

        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        };

    }, [message, navigate]);

    const handleBack = () => {
        navigate("/checkout");
    };

    return (
        <div className="error-page">
            {message === "cancel" ? (

                <div className="error-content">
                    <h2>Payment Canceled</h2>
                    <p>Your payment was canceled. You're being rederecting to checkout page. It may take up to {seconds} sec.</p>
                    <button className="back-btn" onClick={handleBack}>
                        Back to Checkout Page
                    </button>
                </div>
            ) : (
                <div className="error-content">
                    <h2>Payment Failed</h2>
                    <p>Something went wrong with your payment.  You're being rederecting to checkout page. It may take up to {seconds} sec.</p>
                    <button className="back-btn" onClick={handleBack}>
                        Back to Checkout Page
                    </button>
                </div>
            )
            }
        </div>
    );
};

export default Error;