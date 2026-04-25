export type Category = "ANIME" | "ANIMALS" | "CHARACTERS" | "OTHERS";

export interface Product {
  id: string;
  name: string;
  price: number;
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

export const CATEGORY_LABELS: Record<Category, string> = {
  ANIME: "Anime",
  ANIMALS: "Animales",
  CHARACTERS: "Personajes",
  OTHERS: "Otros",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  ANIME: "bg-purple-100 text-purple-800",
  ANIMALS: "bg-green-100 text-green-800",
  CHARACTERS: "bg-blue-100 text-blue-800",
  OTHERS: "bg-yellow-100 text-yellow-800",
};
