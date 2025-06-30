import { useState, ChangeEvent } from "react";
import "./addReview.scss";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface WriteReviewModalProps {
    isOpen: boolean;
    productId: string | undefined;
    handleClose: (e?: React.MouseEvent<HTMLElement>) => void;
    userImage: string;
    handleIsReviewAdded: () => void;
}

const AddReview = ({
    isOpen,
    productId,
    handleClose,
    handleIsReviewAdded,
    userImage,
}: WriteReviewModalProps) => {
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isCategoryReview, setIsCategoryReview] = useState<boolean>(false);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const [categoryRatings, setCategoryRatings] = useState({
        comfort: 1,
        durability: 1,
        fit: 1,
        style: 1,
        valueForMoney: 1,
    });

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);

            // Compress images
            const compressedFiles = await Promise.all(
                fileArray.map(async (file) => {
                    const options = {
                        maxSizeKB: 512,
                        maxWidthOrHeight: 400,
                        useWebWorker: true,
                    };
                    return await imageCompression(file, options);
                })
            );

            setImages((prev) => [...prev, ...compressedFiles]);

            const urls = compressedFiles.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...urls]);
        }
    };

    const convertImagesToBase64 = async (files: File[]): Promise<string[]> => {
        const base64Images: string[] = [];
        for (const file of files) {
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
            });
            reader.readAsDataURL(file);
            base64Images.push(await base64Promise);
        }
        return base64Images;
    };

    const handleCategoryRatingChange = (category: string, value: number) => {
        setCategoryRatings((prev) => ({
            ...prev,
            [category]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!rating || !message.trim()) {
            console.log("Rating or message is empty");
            toast.error("Please provide a rating and message.");
            return;
        }

        if (!productId) {
            toast.error("Product ID is missing.");
            return;
        }

        try {
            const base64Images = await convertImagesToBase64(images);

            // Submit general review
            const reviewPayload = {
                comment: message,
                rating,
                images: base64Images,
            };

            await axios.post(
                `${baseUrl}/api/shoes/${productId}/review`,
                reviewPayload,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Submit category ratings if enabled
            if (isCategoryReview) {
                await axios.post(
                    `${baseUrl}/api/shoes/${productId}/category-rating`,
                    categoryRatings,
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            toast.success("Review submitted successfully!");
            handleClose();
            setRating(0);
            setMessage("");
            setImages([]);
            setPreviewUrls([]);
            setIsCategoryReview(false);
            setCategoryRatings({
                comfort: 0,
                durability: 0,
                fit: 0,
                style: 0,
                valueForMoney: 0,
            });
            handleIsReviewAdded();
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <img src={userImage} alt="User" className="user-avatar" />
                    <h3>Write a Review</h3>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>

                <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${hover! >= star || rating >= star ? "filled" : ""}`}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(null)}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea
                    placeholder="Write your review..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <label className="file-upload">
                    <input type="file" multiple onChange={handleImageUpload} />
                    Upload image(s)
                </label>

                {previewUrls.length > 0 && (
                    <div className="image-preview-gallery">
                        {previewUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Preview ${index}`} />
                        ))}
                    </div>
                )}

                <div className="category-review">
                    <label>
                        <input
                            type="checkbox"
                            checked={isCategoryReview}
                            onChange={(e) => setIsCategoryReview(e.target.checked)}
                        />
                        Add category ratings
                    </label>
                </div>

                {isCategoryReview && (
                    <div className="category-ratings-section">
                        {["comfort", "durability", "fit", "style", "valueForMoney"].map((category) => (
                            <div key={category} className="category-rating">
                                <label>{category.charAt(0).toUpperCase() + category.slice(1)}:</label>
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={categoryRatings[category as keyof typeof categoryRatings]}
                                        onChange={(e) =>
                                            handleCategoryRatingChange(category, Number(e.target.value))
                                        }
                                    />
                                    <span className="slider-value">
                                        {categoryRatings[category as keyof typeof categoryRatings]}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button onClick={handleSubmit} className="submit-btn">Submit Review</button>
            </div>
        </div>
    );
};

export default AddReview;
