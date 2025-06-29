import React from "react";
import "./loading.scss";

interface LoadingProps {
  height?: string | number;
  width?: string | number;
  overlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ height = "100vh", width = "100vw", overlay = true }) => {
  return (
    <div
      className={overlay ? "loading-overlay" : "loading-plain"}
      style={{ height, width }}
    >
      <div className="loading-spinner">
        <div className="spinner" />
        <span className="loading-text">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;