import React from "react";
import "./reviewsSkeleton.scss";

const fakeArray = Array.from({ length: 3 });

const ReviewsSkeleton: React.FC = () => (
    <div className="review-container">
        <h2>Reviews</h2>
        <div className="review-summary">
            <div className="review-average">
                <div className="skeleton skeleton-big-num" />
                <div className="skeleton-review-stars">
                    <div className="skeleton skeleton-stars" />
                    <div className="skeleton skeleton-small-text" />
                </div>
            </div>
            <div className="review-breakdown">
                {[...Array(5)].map((_, i) => (
                    <div className="breakdown-item" key={i}>
                        <span className="skeleton skeleton-star-label" />
                        <div className="breakdown-bar">
                            <div className="skeleton skeleton-bar-fill" />
                        </div>
                        <span className="skeleton skeleton-count-label" />
                    </div>
                ))}
            </div>
        </div>
        <div className="category-ratings">
            {["Comfort", "Durability", "Style", "Fit", "ValueForMoney"].map((cat, i) => (
                <div className="category-item" key={i}>
                    <span className="skeleton skeleton-cat-num" /> {cat}
                </div>
            ))}
        </div>
        <div className="reviews-list">
            {fakeArray.map((_, idx) => (
                <div className="review-item" key={idx}>
                    <div className="review-header">
                        <div className="review-user">
                            <span className="skeleton skeleton-avatar" />
                            <span className="skeleton skeleton-username" />
                        </div>
                        <div className="review-rating">
                            <span className="skeleton skeleton-rating-num" />
                            <span className="skeleton skeleton-stars" />
                        </div>
                    </div>
                    <div className="review-content">
                        <div className="review-text">
                            <div className="skeleton skeleton-comment" />
                            <div className="review-images">
                                {[...Array(2)].map((_, i) => (
                                    <span className="skeleton skeleton-img-thumb" key={i} />
                                ))}
                            </div>
                            <div className="skeleton skeleton-date" />
                        </div>
                        <div className="review-category-ratings">
                            {[...Array(3)].map((_, i) => (
                                <div className="category-rating-item" key={i}>
                                    <span className="skeleton skeleton-cat-label" />
                                    <div className="progress-bar-container">
                                        <div className="skeleton skeleton-bar-fill" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="review-footer">
            <span className="skeleton skeleton-btn" />
        </div>
    </div>
);

export default ReviewsSkeleton;