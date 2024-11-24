import React from 'react';
import DOMPurify from 'dompurify';

interface RichTextProps {
  content: string;
  className?: string;
}

const RichTextDisplay = ({ content, className = '' }: RichTextProps) => {
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className={`prose prose-slate max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichTextDisplay;
