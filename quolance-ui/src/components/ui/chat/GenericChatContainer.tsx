import React from 'react';
import useWindowDimensions from '@/util/hooks/useWindowDimensions';

interface GenericChatContainerProps {
  isMinimized: boolean;
  width: number;
  height: number;
  children: React.ReactNode;
}

function GenericChatContainer({
  isMinimized,
  width,
  height,
  children,
}: GenericChatContainerProps) {
  const { isMobile, width: windowWidth } = useWindowDimensions();
  return (
    <div
      className={`transition-height border-t border-gray-200 bg-slate-50 shadow-md drop-shadow-md transition-all duration-200`}
      style={{
        height: isMobile ? height : isMinimized ? 0 : height,
        width: isMobile ? windowWidth : width,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

export default GenericChatContainer;
