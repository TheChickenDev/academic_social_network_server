export interface ImageData {
  url: string;
  publicId: string;
}

export interface SearchQueryParams {
  q: string;
  type?: string;
  filter: string;
  userId?: string;
  page?: number;
  limit?: number;
}
