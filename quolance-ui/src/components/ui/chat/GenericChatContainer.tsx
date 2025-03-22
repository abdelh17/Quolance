// GenericChatContainer
// This component is a generic chat container that can be used by ChatContainer, ConversationContainer, and NewChatContainer.

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
      className='bg-slate-50 drop-shadow-md transition-all duration-200'
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
