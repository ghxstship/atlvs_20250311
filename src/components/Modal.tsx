import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl'
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <FocusTrap>
      <div 
        className="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-mono-900/75 transition-opacity"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <div
            ref={modalRef}
            className={cn(
              'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl',
              'transition-all sm:my-8 sm:w-full',
              sizeClasses[size],
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-mono-200">
              <h3 
                id="modal-title"
                className="text-lg font-medium text-mono-900"
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-mono-400 hover:text-mono-500 focus:outline-none focus:ring-2 focus:ring-mono-500"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
}