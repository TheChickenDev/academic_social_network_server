export interface ImageData {
  url: string;
  publicId: string;
}

export interface SearchQueryParams {
  q: string;
  type?: string;
  filter: string;
  email?: string;
  page?: number;
  limit?: number;
}
