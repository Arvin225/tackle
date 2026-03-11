import React from "react";

interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = "100%",
  height = "20px",
  className = "",
}) => {
  return (
    <div
      className={`animate-pulse bg-[#d2d2d7] dark:bg-[#48484a] rounded ${className}`}
      style={{ width, height }}
    />
  );
};
