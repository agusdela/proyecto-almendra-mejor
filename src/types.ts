/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string; // Friendly URL or ID
  categoryName: string;
  prices: { [weight: string]: number }; // e.g. { "250g": 1200, "500g": 2200, "1kg": 4000 }
  originalPrices?: { [weight: string]: number }; // e.g. { "250g": 1500 } (for discounts)
  defaultWeight: string; // e.g. "250g" or "1ud"
  weights: string[]; // Options e.g. ["250g", "500g", "1kg"]
  rating: number; // e.g. 4.8
  reviewCount: number; // e.g. 18
  image: string; // URL
  description: string;
  ingredients: string;
  nutritionFacts: {
    servingSize: string;
    calories: string;
    carbs: string;
    protein: string;
    fats: string;
    sodium: string;
  };
  tags: string[]; // e.g. ["Sin TACC", "Vegano", "Orgánico", "Oferta", "Gourmet"]
  featured: boolean;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  image: string; // Visual beautiful representing category
  icon: string; // Name of Lucide Icon to render
}

export interface BlogArticle {
  id: string;
  title: string;
  summary: string;
  content: string; // Detailed content
  author: string;
  date: string;
  image: string;
  category: string; // e.g. "Alimentación saludable", "Recetas", "Nutrición", "Bienestar", "Vida sana"
  readTime: string; // e.g. "5 min read"
}

export interface CustomerReview {
  id: string;
  clientName: string;
  rating: number;
  text: string;
  date: string;
  verifiedPurchase: boolean;
  productName?: string; // Optional for site-wide reviews or product specific
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string; // Crucial for multi-weight checkout
}

export interface FilterState {
  searchQuery: string;
  category: string; // "" means all
  brand: string; // "" means all
  priceRange: [number, number]; // [min, max]
  rating: number; // 0 means any
  tags: string[]; // e.g., ["Sin TACC", "Vegano", "Orgánico"]
  sortBy: string; // "featured" | "price-asc" | "price-desc" | "rating"
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minimumPurchase: number;
}

export interface CheckoutDetails {
  personal: {
    name: string;
    email: string;
    phone: string;
    dni: string;
  };
  address: {
    street: string;
    number: string;
    apartment?: string;
    city: string;
    province: string;
    zipCode: string;
  };
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    eta: string;
  };
  paymentMethod: {
    type: "credit" | "transfer" | "cash";
    cardName?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
  };
}
