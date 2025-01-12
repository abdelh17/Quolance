/** Pagination **/
export interface PaginationParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface PageMetaData {
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  totalElements: number;
  totalPages: number;
}

export const PaginationQueryDefault = {
  page: 0,
  size: 10,
  sortBy: undefined,
  sortDirection: undefined,
};
