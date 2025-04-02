import React, { useEffect, useRef, useState } from 'react';

type TooltipPosition =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: TooltipPosition;
  disabled?: boolean;
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  disabled = false,
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    if (disabled) return;
    setIsMounted(true);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    // Add a small delay before unmounting to allow fade out animation
    setTimeout(() => setIsMounted(false), 200);
  };

  const getPositionClasses = () => {
    switch (position) {
      // Top positions
      case 'top-start':
        return 'bottom-full left-0 mb-2';
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'top-end':
        return 'bottom-full right-0 mb-2';

      // Right positions
      case 'right-start':
        return 'left-full top-0 ml-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      case 'right-end':
        return 'left-full bottom-0 ml-2';

      // Bottom positions
      case 'bottom-start':
        return 'top-full left-0 mt-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'bottom-end':
        return 'top-full right-0 mt-2';

      // Left positions
      case 'left-start':
        return 'right-full top-0 mr-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'left-end':
        return 'right-full bottom-0 mr-2';

      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-200';

    if (!isVisible) {
      return `${baseClasses} opacity-0 scale-95`;
    }

    switch (position) {
      case 'top':
      case 'top-start':
      case 'top-end':
        return `${baseClasses} opacity-100 transform-gpu translate-y-0`;
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        return `${baseClasses} opacity-100 transform-gpu translate-y-0`;
      case 'left':
      case 'left-start':
      case 'left-end':
        return `${baseClasses} opacity-100 transform-gpu translate-x-0`;
      case 'right':
      case 'right-start':
      case 'right-end':
        return `${baseClasses} opacity-100 transform-gpu translate-x-0`;
      default:
        return `${baseClasses} opacity-100 scale-100`;
    }
  };

  return (
    <div
      ref={childRef}
      className='relative inline-block w-full'
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isMounted && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 min-w-max max-w-xs transform-gpu whitespace-normal rounded bg-[#6d6d6d] px-3 py-2 text-sm font-medium
            text-white shadow-sm
            ${getPositionClasses()}
            ${getAnimationClasses()}
            ${className}
          `}
          role='tooltip'
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
