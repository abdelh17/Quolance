import React from 'react';
import Avatar from '@/components/ui/chat/Avatar';
import useWindowDimensions from '@/util/hooks/useWindowDimensions';

interface GenericChatHeaderProps {
  title: string;
  avatar?: string;
  width: number;
  buttons: {
    icon: React.ReactElement;
    onClick: () => void;
    isVisible: boolean;
  }[];
  onMinimize?: () => void;
  isUnread?: boolean;
}

function GenericChatHeader({
  title,
  avatar,
  width,
  buttons,
  onMinimize,
  isUnread,
}: GenericChatHeaderProps) {
  const { isMobile } = useWindowDimensions();
  return (
    <div
      className={
        'bg-white p-[10px] pb-[8px] pl-[16px] shadow-md drop-shadow-md transition-all duration-200 hover:bg-gray-100 sm:rounded-t-xl sm:px-[11px] sm:pl-[11px]'
      }
      style={{ width: isMobile ? '100%' : width }}
    >
      <div
        className={'flex h-full w-full cursor-pointer items-center'}
        onClick={onMinimize}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onMinimize?.();
        }}
      >
        <Avatar src={avatar} size={'sm'} />
        <h1 className={'ml-2 max-w-[calc(100%-80px)] truncate'} title={title}>
          {title}
        </h1>
        {isUnread && <div className={'bg-b300 ml-2 h-2 w-2 rounded-full'} />}
        <div className={'ml-auto flex text-gray-600'}>
          {buttons.map((button, index) => (
            <button
              className={
                'rounded-full p-2 transition-colors hover:bg-gray-600/10'
              }
              style={{ display: button.isVisible ? 'block' : 'none' }}
              key={index}
              onClick={(event) => {
                event.stopPropagation();
                button.onClick();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' || e.key === ' ') {
                  button.onClick();
                }
              }}
            >
              {button.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GenericChatHeader;
