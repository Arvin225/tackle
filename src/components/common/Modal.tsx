import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  showCloseButton = true,
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`glass-panel relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto animate-scale-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-[#e5e5e5] dark:border-[#38383a]">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5 text-[#86868b] dark:text-[#8e8e93]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

interface ModalContentProps {
  children: React.ReactNode
}

export const ModalContent: React.FC<ModalContentProps> = ({ children }) => {
  return <div>{children}</div>
}

interface ModalFooterProps {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  align = 'right',
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 border-t border-[#e5e5e5] dark:border-[#38383a] ${alignClasses[align]}`}
    >
      {children}
    </div>
  )
}
