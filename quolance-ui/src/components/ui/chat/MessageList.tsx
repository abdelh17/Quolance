// MessageList
// Show the list of Messages in the conversation.
// Messages will be shown as a list of MessageGroup components.
// A MessageGroup can contain 1 or more messages.
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MessageDto } from '@/constants/types/chat-types';
import MessageGroup from '@/components/ui/chat/MessageGroup';
import { FiArrowDown } from 'react-icons/fi';
import { groupMessages } from '@/util/chatUtils';

interface MessageListProps {
  chatUserCard?: React.ReactNode;
  messages: MessageDto[];
  isMinimized: boolean;
}

function MessageList({
  messages,
  isMinimized,
  chatUserCard,
}: MessageListProps) {
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  const groupedMessages = groupMessages(messages);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      const isAtBottom = scrollTop >= scrollHeight - clientHeight - 10;
      setShowScrollDown(!isAtBottom);
    }
  };

  useEffect(() => {
    if (!isMinimized) {
      const timeout = setTimeout(() => {
        scrollToBottom();
        handleScroll();
      }, 10);

      return () => clearTimeout(timeout);
    }
  }, [isMinimized]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();

    const messageList = messageListRef.current;
    if (messageList) {
      messageList.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (messageList) {
        messageList.removeEventListener('scroll', handleScroll);
      }
    };
  }, [messages]);

  return (
    <div className='relative h-full'>
      <div
        id='message-list'
        ref={messageListRef}
        className='h-full overflow-y-auto p-4 last:mb-0'
      >
        {chatUserCard}
        {groupedMessages.map((group, index) => (
          <MessageGroup key={index} messages={group} />
        ))}
      </div>

      <div
        className={`absolute bottom-6 right-6 z-10 transition-all duration-300 ease-in-out ${
          showScrollDown
            ? 'opacity-100'
            : 'pointer-events-none bottom-4 opacity-0'
        }`}
      >
        <button
          onClick={() => {
            if (messageListRef.current) {
              const scrollHeight = messageListRef.current.scrollHeight;
              const start = messageListRef.current.scrollTop;
              const change = scrollHeight - start;
              const duration = 400;
              let startTime: number;

              const animateScroll = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;

                if (elapsed < duration && messageListRef.current) {
                  const t = elapsed / duration;
                  const factor = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                  messageListRef.current.scrollTop = start + change * factor;
                  requestAnimationFrame(animateScroll);
                } else if (messageListRef.current) {
                  messageListRef.current.scrollTop = scrollHeight;
                }
              };

              requestAnimationFrame(animateScroll);
            }
          }}
          className='rounded-full bg-white p-2 shadow-md transition-all duration-200 hover:bg-gray-50'
          aria-label='Scroll to bottom'
        >
          <FiArrowDown className='text-2xl text-blue-500' />
        </button>
      </div>
    </div>
  );
}

export default MessageList;
