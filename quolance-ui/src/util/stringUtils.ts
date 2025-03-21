import { ProjectFilterQuery } from '@/api/projects-api';

export const formatEnumString = (enumObj: string): string => {
  return enumObj
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};
export const formatDate = (date: string) => {
  // Date format: "2024-11-09"
  // Output format: "November 9, 2024"
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const formatTimeForChat = (date: string) => {
  // Parse the timestamp
  const timestamp = new Date(date);
  const now = new Date();

  // Calculate time difference in milliseconds
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // Less than 5 minutes, show "Just now"
  if (diffMinutes < 5) {
    return 'Just now';
  }

  // Check if it's within 24 hours
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    // Format as "xx:xx AM/PM"
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Check if it's within 48 hours (yesterday)
  if (diffHours < 48) {
    return 'Yesterday';
  }

  // More than 48 hours, show "Month Day" (short month name)
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateObject = (date: Date) => {
  // Check if date is date object
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    return '';
  }
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const formatPriceRange = (priceRange: string) => {
  switch (priceRange) {
    case 'LESS_500':
      return `$0 – $500`;
    case 'BETWEEN_500_1000':
      return '$500 – $1000';
    case 'BETWEEN_1000_5000':
      return '$1000 – $5000';
    case 'BETWEEN_5000_10000':
      return '$5000 – $10000';
    case 'MORE_10000':
      return '$10000+';
    default:
      return priceRange;
  }
};

export const formatPriceRangeNoDollar = (priceRange: string) => {
  return formatPriceRange(priceRange).replace(/\$/g, '');
};

export const queryToString = (
  query: { [s: string]: unknown } | ArrayLike<unknown> | ProjectFilterQuery
): string => {
  const filteredQuery: Record<string, string> = Object.fromEntries(
    Object.entries(query).filter(
      ([_, value]) => value !== undefined && value !== ''
    )
  ) as Record<string, string>;

  return new URLSearchParams(filteredQuery).toString();
};

export const getFirstName = (fullName: string) => {
  return fullName.split(' ')[0];
};
