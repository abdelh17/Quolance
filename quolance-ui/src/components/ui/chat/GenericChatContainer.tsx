import React from 'react';

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
  return (
    <div
      className='border-t border-gray-200 bg-slate-50 shadow-md drop-shadow-md transition-all duration-200'
      style={{
        height: isMinimized ? 0 : height,
        width,
        overflow: 'hidden',
      }}
    >
      {children}{' '}
    </div>
  );
}
export default GenericChatContainer;
