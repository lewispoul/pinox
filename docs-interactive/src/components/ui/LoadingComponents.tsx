'use client';

import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'gray';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  text,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Animated spinner */}
      <div className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`} />
      
      {text && (
        <div className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
          <span className="inline-block w-6 text-left">
            {'.'.repeat(dots)}
          </span>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

// Skeleton loading components for different content types
interface SkeletonProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded animate-pulse ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 bg-white ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
      </div>
      <SkeletonText lines={2} />
      <div className="flex space-x-2 mt-4">
        <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

// Enhanced button with loading states and animations
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = ''
}: AnimatedButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''}
        ${className}
      `}
    >
      {loading && (
        <LoadingSpinner size="sm" color={variant === 'secondary' ? 'gray' : 'blue'} />
      )}
      <span className={loading ? 'ml-2' : ''}>{children}</span>
    </button>
  );
}

// Toast notification system
export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose(id);
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  if (!isVisible) return null;

  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div
      className={`
        fixed top-4 right-4 max-w-md border rounded-lg p-4 shadow-lg backdrop-blur-sm z-50
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        ${typeClasses[type]}
      `}
    >
      <div className="flex items-start">
        <span className="text-lg mr-3">{iconMap[type]}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          {message && <p className="text-xs mt-1 opacity-80">{message}</p>}
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose(id);
            }, 300);
          }}
          className="ml-2 text-lg leading-none opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Progress bar component
interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple';
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  progress,
  size = 'md',
  color = 'blue',
  animated = true,
  showLabel = true,
  className = ''
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600'
  };

  const normalizedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-600">
          <span>Progress</span>
          <span>{normalizedProgress}%</span>
        </div>
      )}
      <div className={`bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`
            ${colorClasses[color]} 
            ${sizeClasses[size]} 
            rounded-full transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>
    </div>
  );
}
