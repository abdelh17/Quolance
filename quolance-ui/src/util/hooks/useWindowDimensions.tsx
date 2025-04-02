import { useEffect, useState } from 'react';

interface WindowDimensions {
  width: number;
  height: number;
}

/**
 * Hook to get the current window dimensions
 * Automatically updates when window is resized
 * Safe for SSR (returns default values until client-side hydration)
 */

function useWindowDimensions(): WindowDimensions {
  // Default dimensions for SSR
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: 0,
    height: 0,
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

  return { width: windowDimensions.width, height: windowDimensions.height };
}

export default useWindowDimensions;
