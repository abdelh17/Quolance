import React, { useEffect, useRef, useState } from 'react';
import DOMPurify, { Config } from 'dompurify';

interface SanitizedHtmlDisplayProps {
  /** HTML content to be displayed */
  htmlContent: string;
  /** Maximum height in pixels. Content will be truncated with gradient if it exceeds this height */
  maxHeight?: number;
  /** Custom CSS class name */
  className?: string;
  /** Custom sanitization options */
  sanitizeOptions?: Config;
  /** Custom gradient colors for the fade effect */
  gradientColors?: {
    from: string;
    to: string;
  };
}

interface ContainerStyles extends React.CSSProperties {
  maxHeight: string | number;
  overflow: 'hidden' | 'visible';
  position: 'relative';
}

interface GradientStyles extends React.CSSProperties {
  display: 'none' | 'block';
  position: 'absolute';
  bottom: 0;
  left: 0;
  right: 0;
  height: string;
  background: string;
  pointerEvents: 'none';
}

const SanitizedHtmlDisplay: React.FC<SanitizedHtmlDisplayProps> = ({
  htmlContent,
  maxHeight,
  className = '',
  sanitizeOptions,
  gradientColors = { from: 'transparent', to: 'white' },
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('');

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

    // Convert TrustedHTML to string
    const clean = DOMPurify.sanitize(
      htmlContent,
      sanitizeOptions || defaultSanitizeOptions
    ).toString();

    setSanitizedHtml(clean);
  }, [htmlContent, sanitizeOptions]);

  useEffect(() => {
    const checkOverflow = (): void => {
      if (contentRef.current && maxHeight) {
        const element = contentRef.current;
        setIsOverflowing(element.scrollHeight > element.clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [maxHeight, sanitizedHtml]);

  const containerStyle: ContainerStyles = {
    maxHeight: maxHeight ? `${maxHeight}px` : 'none',
    overflow: maxHeight ? 'hidden' : 'visible',
    position: 'relative',
  };

  const gradientStyle: GradientStyles = {
    display: isOverflowing ? 'block' : 'none',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50px',
    background: `linear-gradient(to bottom, ${gradientColors.from}, ${gradientColors.to})`,
    pointerEvents: 'none',
  };

  return (
    <div
      className={`relative ${className}`.trim()}
      style={{ position: 'relative' }}
    >
      <div
        ref={contentRef}
        style={containerStyle}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        className='prose max-w-none'
      />
      {maxHeight && (
        <div
          style={gradientStyle}
          aria-hidden='true'
          data-testid='gradient-overlay'
        />
      )}
    </div>
  );
};

export default SanitizedHtmlDisplay;
