import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullScreen?: boolean
  text?: string
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullScreen = false,
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  }

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? 'fixed inset-0 z-50 bg-[#f5f5f7] dark:bg-[#1c1c1e]' : ''}`}
    >
      <svg
        className={`${sizeClasses[size]} animate-spin text-[#007aff]`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className={`${textSize[size]} text-[#86868b] dark:text-[#8e8e93]`}>
          {text}
        </p>
      )}
    </div>
  )
}

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '20px',
}) => {
  return (
    <div
      className={`bg-[#e5e5e5] rounded animate-pulse dark:bg-[#2c2c2e] ${className}`}
      style={{ width, height }}
    />
  )
}

interface SkeletonListProps {
  count?: number
  itemClassName?: string
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 5,
  itemClassName = '',
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-12 rounded ${itemClassName}`}
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  imageHeight?: string | number
  textLines?: number
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  imageHeight = '200px',
  textLines = 3,
}) => {
  return (
    <div className="glass-card p-4 rounded-lg animate-pulse">
      <Skeleton height={imageHeight} className="mb-4" />
      <Skeleton className="mb-2" width="60%" />
      <Skeleton className="mb-1" width="40%" />
      {textLines > 1 && <Skeleton width="80%" />}
    </div>
  )
}
