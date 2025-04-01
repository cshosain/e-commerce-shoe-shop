import "./orderSummary.scss";
import useFetchCart from "../../customHooks/useFetchCart";
type Props = {
    shipingCost: number;
}

const OrderSummary = (props: Props) => {
    const { cartItems, totalPrice } = useFetchCart()
    console.log(cartItems)
    const { shipingCost } = props;
    //shiping cost $10 per item and tax = 30% of product price.
    const subTotal = shipingCost * cartItems.length * 10 + totalPrice + parseFloat((totalPrice * 0.3).toFixed(2));
    console.log(cartItems)
    console.log(shipingCost)

    return (
        <div className="order-summary">
            <h3>Order Summary <a href="#" className="edit-cart">Edit cart</a></h3>
            <div className="summary-item">
                <span>Merchandise:</span>
                <span className="price">$ {totalPrice}</span>
            </div>
            <div className="summary-item">
                <span>Shipping & Handling:</span>
                <span style={{ color: !shipingCost ? 'green' : "black" }} className="price"> {shipingCost === 0 ? "Free" : '$ ' + shipingCost * cartItems.length * 10}</span>
            </div>
            <div className="summary-item">
                <span>Tax:</span>
                <span className="price">$ {(totalPrice * 0.3).toFixed(2)}</span>
            </div>
            <hr />
            <div className="summary-item total">
                <span>Order Total:</span>
                <span className="price">$ {subTotal}</span>
            </div>
        </div>
    );
};

export default OrderSummary;
