import "./productsSkeleton.scss";

const skeletonArray = Array.from({ length: 8 });

const ProductsSkeleton = () => (
    <div className="outer-products-skeleton">
        <div className="products">
            {skeletonArray.map((_, idx) => (
                <div className="card skeleton-card" key={idx}>
                    <div className="skeleton skeleton-img" />
                    <div className="card-details-skeleton">
                        <div className="skeleton skeleton-title" />
                        <div className="skeleton skeleton-rating" />
                        <div className="skeleton skeleton-price" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ProductsSkeleton;