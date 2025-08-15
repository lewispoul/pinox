'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Responsive breakpoint hook
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
}

// Mobile detection hook
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Touch gesture hook for mobile interactions
export function useTouchGestures(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void
) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          onSwipeUp?.();
        } else {
          onSwipeDown?.();
        }
      }
    }

    setTouchStart(null);
  };

  return { handleTouchStart, handleTouchEnd };
}

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4,
  className = ''
}: ResponsiveGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const gapClass = `gap-${gap}`;

  return (
    <div
      className={`
        grid ${gapClass}
        ${cols.sm ? `${gridCols[cols.sm]}` : ''}
        ${cols.md ? `md:${gridCols[cols.md]}` : ''}
        ${cols.lg ? `lg:${gridCols[cols.lg]}` : ''}
        ${cols.xl ? `xl:${gridCols[cols.xl]}` : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Mobile-optimized drawer component
interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
}

export function MobileDrawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right'
}: MobileDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const positionClasses = {
    left: {
      container: 'left-0 top-0 h-full',
      transform: isOpen ? 'translate-x-0' : '-translate-x-full',
      width: 'w-80 max-w-[80vw]'
    },
    right: {
      container: 'right-0 top-0 h-full',
      transform: isOpen ? 'translate-x-0' : 'translate-x-full',
      width: 'w-80 max-w-[80vw]'
    },
    bottom: {
      container: 'bottom-0 left-0 right-0',
      transform: isOpen ? 'translate-y-0' : 'translate-y-full',
      width: 'w-full max-h-[80vh]'
    }
  };

  const positionConfig = positionClasses[position];

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          fixed z-50 bg-white shadow-xl
          ${positionConfig.container}
          ${positionConfig.width}
          transition-transform duration-300 ease-in-out
          ${positionConfig.transform}
        `}
        onTransitionEnd={() => {
          if (!isOpen) setIsAnimating(false);
        }}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="p-4 overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </>
  );
}

// Collapsible section for mobile
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className = ''
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-left font-semibold">{title}</h3>
        <span
          className={`transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▼
        </span>
      </button>
      
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-4 border-t">
          {children}
        </div>
      </div>
    </div>
  );
}

// Sticky header component
interface StickyHeaderProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

export function StickyHeader({ children, className = '', threshold = 100 }: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return (
    <div
      className={`
        sticky top-0 z-30 transition-all duration-200
        ${isSticky ? 'shadow-md bg-white/95 backdrop-blur-sm' : 'bg-white'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Viewport context for managing responsive behavior
interface ViewportContextType {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const ViewportContext = createContext<ViewportContextType>({
  width: 0,
  height: 0,
  isMobile: false,
  isTablet: false,
  isDesktop: true
});

export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const [viewport, setViewport] = useState<ViewportContextType>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  );
}

export function useViewport() {
  return useContext(ViewportContext);
}
