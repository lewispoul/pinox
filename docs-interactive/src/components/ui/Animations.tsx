'use client';

import { useEffect, useRef, useState } from 'react';

// Fade in animation hook
export function useFadeIn(delay = 0, duration = 0.5) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return {
    ref: elementRef,
    className: `transition-all duration-${Math.round(duration * 1000)} ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`
  };
}

// Slide in from direction
export function useSlideIn(direction: 'left' | 'right' | 'up' | 'down' = 'up', delay = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const directionClasses = {
    left: isVisible ? 'translate-x-0' : '-translate-x-8',
    right: isVisible ? 'translate-x-0' : 'translate-x-8',
    up: isVisible ? 'translate-y-0' : 'translate-y-8',
    down: isVisible ? 'translate-y-0' : '-translate-y-8'
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return {
    ref: elementRef,
    className: `transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    } ${directionClasses[direction]}`
  };
}

// Stagger animation for lists
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggeredList({ children, staggerDelay = 100, className = '' }: StaggeredListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <StaggeredItem key={index} delay={index * staggerDelay}>
          {child}
        </StaggeredItem>
      ))}
    </div>
  );
}

function StaggeredItem({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, className } = useFadeIn(delay);
  
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Animated counter
interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  className = '',
  prefix = '',
  suffix = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOutCubic;
      
      setCount(Math.floor(current));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, start, end, duration]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Hover effect components
interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverShadow?: boolean;
}

export function HoverCard({
  children,
  className = '',
  hoverScale = 1.02,
  hoverShadow = true
}: HoverCardProps) {
  return (
    <div
      className={`
        transition-all duration-200 ease-out cursor-pointer
        hover:scale-${Math.round(hoverScale * 100)}
        ${hoverShadow ? 'hover:shadow-lg' : ''}
        ${className}
      `}
      style={{
        '--tw-scale-x': hoverScale,
        '--tw-scale-y': hoverScale,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// Floating action button with animations
interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  tooltip?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'purple';
}

export function FloatingActionButton({
  onClick,
  icon,
  tooltip,
  position = 'bottom-right',
  size = 'md',
  color = 'blue'
}: FloatingActionButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg'
  };

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25',
    green: 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/25',
    red: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/25',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25'
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      {tooltip && showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap animate-fade-in">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
      
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-200 ease-out
          hover:scale-110 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-opacity-30
        `}
      >
        {icon}
      </button>
    </div>
  );
}

// Ripple effect component
export function useRipple() {
  const [ripples, setRipples] = useState<Array<{
    x: number;
    y: number;
    id: number;
  }>>([]);

  const addRipple = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      id: Date.now()
    };

    setRipples(prev => [...prev, ripple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  };

  const RippleContainer = () => (
    <>
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animation: 'ripple 0.6s ease-out'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );

  return { addRipple, RippleContainer };
}

// Morphing icon component
interface MorphingIconProps {
  icon1: React.ReactNode;
  icon2: React.ReactNode;
  isToggled: boolean;
  size?: number;
  className?: string;
}

export function MorphingIcon({
  icon1,
  icon2,
  isToggled,
  size = 20,
  className = ''
}: MorphingIconProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className={`absolute inset-0 transition-all duration-300 ease-in-out ${
          isToggled ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        {icon1}
      </div>
      <div
        className={`absolute inset-0 transition-all duration-300 ease-in-out ${
          isToggled ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
      >
        {icon2}
      </div>
    </div>
  );
}

// Pulse animation component
interface PulseProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'purple';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function Pulse({ children, color = 'blue', intensity = 'medium', className = '' }: PulseProps) {
  const colorClasses = {
    blue: 'shadow-blue-500/30',
    green: 'shadow-green-500/30',
    red: 'shadow-red-500/30',
    purple: 'shadow-purple-500/30'
  };

  const intensityClasses = {
    low: 'animate-pulse-low',
    medium: 'animate-pulse',
    high: 'animate-pulse-high'
  };

  return (
    <>
      <div className={`${intensityClasses[intensity]} ${colorClasses[color]} ${className}`}>
        {children}
      </div>
      <style jsx>{`
        @keyframes pulse-low {
          0%, 100% { 
            box-shadow: 0 0 0 0 currentColor;
            opacity: 1;
          }
          50% {
            box-shadow: 0 0 0 5px transparent;
            opacity: 0.8;
          }
        }
        @keyframes pulse-high {
          0%, 100% { 
            box-shadow: 0 0 0 0 currentColor;
            opacity: 1;
          }
          50% {
            box-shadow: 0 0 0 15px transparent;
            opacity: 0.7;
          }
        }
        .animate-pulse-low {
          animation: pulse-low 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-high {
          animation: pulse-high 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}

// Typewriter effect
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  className = '',
  cursor = true
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(typeInterval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayText}
      {cursor && !isComplete && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}
