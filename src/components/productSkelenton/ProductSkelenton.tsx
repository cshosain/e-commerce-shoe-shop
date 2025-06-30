
import "./productSkelenton.scss";

const ProductSkeleton = () => (
    <div className="product-page-skeleton">
        <div className="product-container">
            <div className="product-image">
                <div className="skeleton main-image-skeleton" />
                <div className="product-other-images">
                    {[1, 2, 3].map((_, i) => (
                        <div className="skeleton thumb-skeleton" key={i} />
                    ))}
                </div>
            </div>
            <div className="product-details">
                <div className="skeleton title-skeleton" />
                <div className="skeleton rating-skeleton" />
                <div className="skeleton desc-skeleton" />
                <div className="skeleton color-skeleton" />
                <div className="skeleton size-skeleton" />
                <div className="skeleton price-skeleton" />
                <div className="skeleton btn-skeleton" />
                <div className="skeleton review-skeleton" />
            </div>
        </div>
    </div>
);

export default ProductSkeleton;