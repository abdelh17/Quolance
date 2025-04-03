import { useEffect, useState } from 'react';
import { isMobileWidth } from '@/util/utils';

interface WindowDimensions {
  width: number;
  height: number;
}

interface ExtendedWindowDimensions extends WindowDimensions {
  isMobile: boolean;
}

/**
 * Hook to get the current window dimensions
 * Automatically updates when window is resized
 * Safe for SSR (returns default values until client-side hydration)
 */

function useWindowDimensions(): ExtendedWindowDimensions {
  // Default dimensions for SSR
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Function to update dimensions
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set dimensions on initial client-side render
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = isMobileWidth(windowDimensions.width);

  return {
    width: windowDimensions.width,
    height: windowDimensions.height,
    isMobile,
  };
}

export default useWindowDimensions;
