import { useState, useEffect, ChangeEvent } from "react";
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

    const handleSubmit = async () => {
        if (!rating || !message.trim()) {
            toast.error("Please provide a rating and message.");
            return;
        }

        if (!productId) {
            toast.error("Product ID is missing.");
            return;
        }

        try {
            const base64Images = await convertImagesToBase64(images);

            const payload = {
                comment: message,
                rating,
                images: base64Images,
            };

            const response = await axios.post(
                `http://localhost:3000/api/shoes/${productId}/review`,
                payload,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Review submitted successfully!");
            handleClose();
            setRating(0);
            setMessage("");
            setImages([]);
            setPreviewUrls([]);
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

                <button onClick={handleSubmit} className="submit-btn">Submit Review</button>
            </div>
        </div>
    );
};

export default AddReview;
