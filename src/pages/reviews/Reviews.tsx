import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"; // assuming react-router-dom
import axios from "axios";
import "./reviews.scss";
import renderStars from "../../utilities/renderStars";
import AddReview from "../../components/addReview/AddReview";
import { defaultAvatar } from "../../assets/default";
import ImageViewer from "../../components/imageViewer/ImageViewer";

type ReviewData = {
    ratings: { averageRating: number; noOfRatings: number; ratingsBreakdown: { star: number; count: number }[]; categoryRatings: { userName: string; comfort: number; style: number; fit: number; durability: number; valueForMoney: number; _id: string }[]; averageCategoryRatings: { [key: string]: number } };
    reviews: { _id: string; userName: string; userImg: string; rating: number; comment: string; images?: string[]; createdAt: string }[];
}


const Review: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [reviewData, setReviewData] = useState<ReviewData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isReviewAdded, setIsReviewAdded] = useState<boolean>(false);

    // State for ImageViewer
    const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
    const [viewerImages, setViewerImages] = useState<string[]>([]);
    const [viewerIndex, setViewerIndex] = useState<number>(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/shoes/${productId}/ratings-reviews`);
                setReviewData(res.data.data);
                console.log(res.data.data);
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
    if (isReviewAdded) {
        // Clear any existing timeout before setting a new one
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Set a new timeout
        timeoutRef.current = setTimeout(() => {
            window.location.reload();
        }, 2000);

    }

    if (isOpen) {
        document.body.classList.add("stop-scrolling");
    } else {
        document.body.classList.remove("stop-scrolling");
    }

    const handleClose = (e?: React.MouseEvent<HTMLElement>) => {
        if (e) {
            e.stopPropagation();
        }
        setIsOpen((prev) => !prev);
    }
    const handIsReviewAdded = () => {
        setIsReviewAdded((prev) => !prev);
    }

    const handleImageClick = (images: string[], index: number) => {
        setViewerImages(images);
        setViewerIndex(index);
        setIsViewerOpen(true);
        console.log(images, index);
    };

    const handleCloseViewer = () => {
        setIsViewerOpen(false);
    };

    const { reviews, ratings } = reviewData || {};
    // Create a map for category ratings using userName as the key
    // Find corresponding category rating for each review complexity = O(n+m) where n is the number of reviews and m is the number of category ratings
    const categoryRatingsMap = new Map(
        ratings?.categoryRatings.map((catRating) => [catRating.userName, catRating])
    );

    const reviewsWithCategoryRatings = reviews?.map((review) => ({
        ...review,
        categoryRating: categoryRatingsMap.get(review.userName) || null,
    }));

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
                {reviewsWithCategoryRatings?.map((review) => (
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
                        <div className="review-content">
                            <div className="review-text">
                                <p className="review-comment">{review.comment}</p>
                                {review.images && (
                                    <div className="review-images">
                                        {review.images.map((img, index) => (
                                            <img key={index} src={img} alt="Review" onClick={() =>
                                                handleImageClick(review.images!, index)
                                            } // Open ImageViewer
                                                className="review-thumbnail" />
                                        ))}
                                    </div>
                                )}
                                <div className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="review-category-ratings">
                                {review.categoryRating &&
                                    Object.entries(review.categoryRating).map(([key, value]) => {
                                        if (key === "_id" || key === "userName") return null; // Skip _id and userName
                                        const percentage = (typeof value === "number" ? (value / 5) * 100 : 0); // Calculate percentage
                                        return (
                                            <div key={key} className="category-rating-item">
                                                <span className="category-key">
                                                    {key.replace(/^\w/, (c) => c.toUpperCase())}:
                                                </span>
                                                <div className="progress-bar-container">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="review-footer">
                <button onClick={handleClose} className="write-review-btn">Write a review</button>
                {isOpen && (<AddReview productId={productId} isOpen={isOpen} handleClose={handleClose} userImage={defaultAvatar} handleIsReviewAdded={handIsReviewAdded} />)}
            </div>

            {isViewerOpen && (
                <ImageViewer
                    images={viewerImages}
                    initialIndex={viewerIndex}
                    onClose={handleCloseViewer}
                />
            )}
        </div>
    );
};

export default Review;
