import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { TbSend } from 'react-icons/tb';

interface ChatInputProps {
  onSubmit: () => void;
  value: string;
  onChange: (message: string) => void;
  expanded?: boolean;
  setExpanded?: (expanded: boolean) => void;
}

function ChatInput({
  onSubmit,
  value,
  onChange,
  expanded,
  setExpanded,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className='border-t border-gray-200 p-3'>
      <div className='flex items-end gap-2'>
        <textarea
          rows={expanded ? 7 : 3}
          className={`w-full resize-none rounded-lg border border-gray-300 p-2 outline-slate-500 transition-all ${
            expanded
              ? 'max-h-[150px] overflow-y-auto'
              : 'max-h-[50px] overflow-y-hidden'
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder='Type a message...'
          style={{
            lineHeight: '1.25rem',
            fontSize: '0.875rem',
            scrollbarWidth: 'thin',
          }}
        />
        <div
          className='flex flex-col items-center justify-between transition-all'
          style={{ height: expanded ? '150px' : '50px' }}
        >
          <button
            onClick={() => setExpanded?.(!expanded)}
            className='text-slate-500 transition-colors hover:text-slate-700'
          >
            {expanded ? (
              <FaChevronDown className='h-4 w-4' />
            ) : (
              <FaChevronUp className='h-4 w-4' />
            )}
          </button>

          <div className='flex-grow' />

          <button
            onClick={onSubmit}
            disabled={!value.trim()}
            className={`transition-colors ${
              value.trim()
                ? 'text-blue-600 hover:text-blue-700'
                : 'text-slate-300 hover:text-slate-400'
            }`}
          >
            <TbSend className='h-5 w-5' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
