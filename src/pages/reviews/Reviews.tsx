import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // assuming react-router-dom
import axios from "axios";
import "./reviews.scss";
import renderStars from "../../utilities/renderStars";

type ReviewData = {
    ratings: { averageRating: number; noOfRatings: number; ratingsBreakdown: { star: number; count: number }[]; averageCategoryRatings: { [key: string]: number } };
    reviews: { _id: string; userName: string; userImg: string; rating: number; comment: string; images?: string[]; createdAt: string }[];
}


const Review: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [reviewData, setReviewData] = useState<ReviewData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/shoes/${productId}/ratings-reviews`);
                setReviewData(res.data.data);
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    if (!reviewData) return <div className="review-error">No reviews found.</div>;
    if (loading) return <div className="review-loading">Loading...</div>;

    return (
        <div className="review-container">
            <h2>Reviews</h2>

            <div className="review-summary">
                <div className="review-average">
                    <h1>{reviewData.ratings?.averageRating.toFixed(1)}</h1>
                    <div>

                        <div className="review-stars">{renderStars(reviewData.ratings?.averageRating)}</div>
                        <p>{reviewData.ratings?.noOfRatings >= 1000
                            ? `${(reviewData.ratings?.noOfRatings / 1000).toFixed()}K reviews`
                            : reviewData.ratings?.noOfRatings + " reviews"}</p>
                    </div>
                </div>

                <div className="review-breakdown">
                    {reviewData.ratings?.ratingsBreakdown.map((item, index) => (
                        <div key={item.star} style={{ marginBottom: `${reviewData.ratings?.ratingsBreakdown.length - 1 == index ? '0' : '10px'}` }} className="breakdown-item">
                            <span>{item.star}.0</span>
                            <div className="breakdown-bar">
                                <div
                                    className="fill"
                                    style={{ width: `${(item.count / reviewData.ratings?.noOfRatings) * 100}%` }}
                                ></div>
                            </div>
                            <span className="review-count">
                                {item.count >= 1000
                                    ? `${(item.count / 1000).toFixed()}K reviews`
                                    : item.count + " reviews"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="category-ratings">
                {Object.entries(reviewData.ratings?.averageCategoryRatings).map(([category, rating]) => (
                    <div key={category} className="category-item">
                        <span className="rating">{rating.toFixed(1)}</span> {category.replace(/^\w/, (c) => c.toUpperCase())}
                    </div>
                ))}
            </div>

            <div className="reviews-list">
                {reviewData.reviews.map((review) => (
                    <div key={review._id} className="review-item">
                        <div className="review-header">
                            <div className="review-user">
                                <img
                                    src={review.userImg || "/assets/default-avatar.png"} // Fallback to a default avatar
                                    alt={`${review.userName}'s profile`}
                                    className="review-user-img"
                                />
                                {review.userName}
                            </div>
                            <div className="review-rating"><span >{review.rating}</span>{renderStars(review.rating)}</div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        {review.images && (
                            <div className="review-images">
                                {review.images.map((img, index) => (
                                    <img key={index} src={img} alt="Review" />
                                ))}
                            </div>
                        )}
                        <div className="review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            <div className="review-footer">
                <a href="#read-all">Read all reviews</a>
            </div>
        </div>
    );
};

export default Review;
