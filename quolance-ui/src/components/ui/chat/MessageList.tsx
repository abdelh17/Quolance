// MessageList
// Show the list of Messages in the conversation.
// Messages will be shown as a list of MessageGroup components.
// A MessageGroup can contain 1 or more messages.

import React from 'react';
import { MessageDto } from '@/constants/types/chat-types';
import MessageGroup from '@/components/ui/chat/MessageGroup';

const GROUPING_THRESHOLD = 300000; // 5 minutes

function groupMessages(messages: MessageDto[]): MessageDto[][] {
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const groups: MessageDto[][] = [];
  let currentGroup: MessageDto[] = [];

  for (const message of sortedMessages) {
    if (currentGroup.length === 0) {
      currentGroup.push(message);
    } else {
      const lastMessage = currentGroup[currentGroup.length - 1];
      // We check if sameSender by check previous message senderId with current message senderId
      console.log('message last', lastMessage);
      console.log('message current', message);
      const sameSender = lastMessage.sender_id === message.sender_id;
      console.log(sameSender);
      const timeDifference =
        new Date(message.timestamp).getTime() -
        new Date(lastMessage.timestamp).getTime();

      if (sameSender && timeDifference <= GROUPING_THRESHOLD) {
        console.log('here', message);
        currentGroup.push(message);
      } else {
        console.log('there', message);
        groups.push(currentGroup);
        currentGroup = [message];
      }
    }
  }

  if (currentGroup.length) groups.push(currentGroup);
  return groups;
}

interface MessageListProps {
  messages: MessageDto[];
}

function MessageList({ messages }: MessageListProps) {
  // We need an algorithm to group messages by sender and time
  const groupedMessages = groupMessages(messages);

  return (
    <div className={'h-full overflow-y-auto p-4'}>
      {groupedMessages.map((group, index) => (
        <MessageGroup key={index} messages={group} />
      ))}
    </div>
  );
}

export default MessageList;
