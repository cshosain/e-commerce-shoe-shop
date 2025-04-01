import "./paymentOptions.scss";

type Props = {
    selectedMethod: string | null;
    setSelectedMethod: React.Dispatch<React.SetStateAction<string | null>>;
};

const PaymentOptions = (props: Props) => {
    const { selectedMethod, setSelectedMethod } = props;

    const handlePaymentSelection = (method: string) => {
        setSelectedMethod(method);
    };

    return (
        <div className="checkout-form-only">
            <h2>Payment Methods</h2>
            <div className="payment-options">
                <div
                    className={`payment-option ${selectedMethod === "bkash" ? "selected" : ""}`}
                    onClick={() => handlePaymentSelection("bkash")}
                >
                    Pay with bKash
                </div>
                <div
                    className={`payment-option ${selectedMethod === "cod" ? "selected" : ""}`}
                    onClick={() => handlePaymentSelection("cod")}
                >
                    Cash on Delivery
                </div>
                <div
                    className={`payment-option ${selectedMethod === "other" ? "selected" : ""}`}
                    onClick={() => handlePaymentSelection("other")}
                >
                    Other Methods
                </div>
            </div>
        </div>
    );
};

export default PaymentOptions;
