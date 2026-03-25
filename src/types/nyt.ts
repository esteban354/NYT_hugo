// ═══ BOOK TYPES ═══

export interface Book {
  rank?: number;
  title: string;
  author: string;
  publisher: string;
  description: string;
  book_image: string;
  amazon_product_url: string;
  weeks_on_list?: number;
}

export interface Article {
  title: string;
  abstract: string;
  byline: string;
  section: string;
  published_date: string;
  url: string;
}

export type Period = 1 | 7 | 30;

export interface BooksList {
  list_name: string;
  books: Book[];
}

export interface CategoryName {
  list_name: string;
  display_name: string;
  list_name_encoded: string;
  oldest_published_date: string;
  newest_published_date: string;
  updated: string;
}

export interface Review {
  url: string;
  publication_dt: string;
  byline: string;
  book_title: string;
  book_author: string;
  summary: string;
}

// ═══ API RESPONSE TYPES ═══

export interface BooksListResponse {
  results: {
    books: Book[];
  };
}

export interface NamesResponse {
  results: {
    lists: CategoryName[];
  };
}

export interface ReviewsResponse {
  results: Review[];
}

// ═══ APP STATE TYPES ═══

export type AppView = 
  | 'current'
  | 'history-search';

export type BookSubSection = 'trade-fiction-paperback';
