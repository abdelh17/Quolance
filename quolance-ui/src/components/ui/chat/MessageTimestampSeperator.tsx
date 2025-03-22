import React from 'react';
import { formatTimestampString } from '@/util/chatUtils';

interface MessageTimestampSeparatorProps {
  timestamp: string;
  separatorColor?: string;
}

const MessageTimestampSeparator: React.FC<MessageTimestampSeparatorProps> = ({
  timestamp,
  separatorColor = 'bg-slate-200',
}) => {
  return (
    <div className={`my-4 flex w-full items-center justify-center`}>
      <div className={`h-px flex-grow ${separatorColor}`}></div>
      <div className='mx-4 whitespace-nowrap text-xs text-gray-500'>
        {formatTimestampString(timestamp)}
      </div>
      <div className={`h-px flex-grow ${separatorColor}`}></div>
    </div>
  );
};

export default MessageTimestampSeparator;
