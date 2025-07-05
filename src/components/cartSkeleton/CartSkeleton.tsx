import "./cartSkeleton.scss";

const CartSkeleton = () => (
    <div className="cart-skeleton-page">
        <div className="item-skeleton">

            {[1, 2].map((i) => (
                <div className="cart-skeleton-item" key={i}>
                    <div className="skeleton skeleton-img" />
                    <div className="skeleton-details">
                        <div className="skeleton skeleton-title" />
                        <div className="skeleton skeleton-text" />
                        <div className="skeleton skeleton-qty" />
                        <div className="skeleton skeleton-btn" />
                    </div>
                </div>
            ))}
        </div>
        <div className="cart-skeleton-summary">
            <div className="skeleton skeleton-total" />
            <div className="skeleton skeleton-checkout" />
        </div>
    </div>
);

export default CartSkeleton;