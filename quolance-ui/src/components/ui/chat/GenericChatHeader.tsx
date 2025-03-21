// GenericChatHeader

// Will be used to standardize the styling of chat header
// Can be passed a title, avatar, and a list of buttons: {icon: ReactIcon, onClick: () => void}

import React from 'react';
import Avatar from '@/components/ui/chat/Avatar';

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
}

function GenericChatHeader({
  title,
  avatar,
  width,
  buttons,
  onMinimize,
}: GenericChatHeaderProps) {
  return (
    <div
      className={
        'bg-b400 hover:bg-b500 rounded-t-xl p-[10px] px-[11px] pb-[8px] text-slate-200 drop-shadow-md transition-all duration-200'
      }
      style={{ width }}
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
        <div className={'ml-auto flex'}>
          {buttons.map((button, index) => (
            <button
              className={'rounded-full p-2 transition-colors hover:bg-white/10'}
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
