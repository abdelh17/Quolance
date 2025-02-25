'use client';
import React, { useEffect, useRef, useState } from 'react';
import DOMPurify, { Config } from 'dompurify';
import { cn } from '@/util/utils';

interface SanitizedHtmlDisplayProps {
  /** HTML content to be displayed */
  htmlContent: string;
  /** Maximum height in pixels. Content will be truncated with ellipsis if it exceeds this height */
  maxHeight?: number;
  /** Custom CSS class name */
  className?: string;
  /** Custom sanitization options */
  sanitizeOptions?: Config;
}

const SanitizedHtmlDisplay: React.FC<SanitizedHtmlDisplayProps> = ({
  htmlContent,
  maxHeight,
  className = '',
  sanitizeOptions,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('');
  const [lineClamp, setLineClamp] = useState<number>(0);

  useEffect(() => {
    const defaultSanitizeOptions: Config = {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'ul',
        'ol',
        'li',
        'span',
        'div',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'img',
        'a',
      ],
      ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'style'],
    };

    const clean = DOMPurify.sanitize(
      htmlContent,
      sanitizeOptions || defaultSanitizeOptions
    ).toString();

    setSanitizedHtml(clean);
  }, [htmlContent, sanitizeOptions]);

  useEffect(() => {
    if (maxHeight && contentRef.current) {
      const lineHeight =
        parseInt(window.getComputedStyle(contentRef.current).lineHeight) || 20;
      const estimatedLines = Math.floor(maxHeight / lineHeight);
      setLineClamp(estimatedLines);
    }
  }, [maxHeight]);

  // Determine the line-clamp class based on the calculated number of lines
  const getLineClampClass = () => {
    if (!maxHeight) return '';

    // Tailwind provides line-clamp-1 through line-clamp-6 by default
    if (lineClamp <= 6) return `line-clamp-${lineClamp}`;

    // For larger values, we'll need to use arbitrary values
    // Note: This might need to be added to your Tailwind config
    return `line-clamp-[${lineClamp}]`;
  };

  return (
    <div className={cn('relative', className)}>
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        className={cn(
          'prose max-w-none',
          maxHeight && [
            'overflow-hidden',
            getLineClampClass(),
            `max-h-[${maxHeight}px]`,
          ]
        )}
      />
    </div>
  );
};

export default SanitizedHtmlDisplay;
