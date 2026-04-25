export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  category: Category;
  description: string | null;
  imageUrl: string;
  available: boolean;
  createdAt: string;
}

export interface Config {
  whatsappNumber: string;
  storeName: string;
  currencySymbol: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}
