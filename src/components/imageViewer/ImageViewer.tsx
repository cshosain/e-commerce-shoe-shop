import React, { useState } from "react";
import "./imageViewer.scss";

interface ImageViewerProps {
    images: string[];
    initialIndex?: number; // Optional: Start with a specific image
    onClose: () => void; // Callback to close the viewer
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loop to the first image
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); // Loop to the last image
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose(); // Close the viewer when clicking outside the image
        }
    };

    return (
        <div className="image-viewer-overlay" onClick={handleOverlayClick}>
            <div className="image-viewer-content">
                <button className="arrow left-arrow" onClick={handlePrev}>
                    &#8592;
                </button>
                <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} className="image-viewer-img" />
                <button className="arrow right-arrow" onClick={handleNext}>
                    &#8594;
                </button>
            </div>
        </div>
    );
};

export default ImageViewer;