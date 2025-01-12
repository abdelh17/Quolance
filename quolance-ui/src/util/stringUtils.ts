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
