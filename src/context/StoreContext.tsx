/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, FilterState, Coupon, CheckoutDetails } from "../types";
import { discountCoupons, deliveryRates } from "../data/mockData";

export type ViewType = "home" | "shop" | "blog" | "about" | "contact" | "wishlist" | "checkout";

interface StoreContextProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  activeProductId: string | null;
  setActiveProductId: (id: string | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, weight: string) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateCartQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isProductInWishlist: (productId: string) => boolean;
  currency: "ARS" | "USD";
  setCurrency: (currency: "ARS" | "USD") => void;
  location: string;
  setLocation: (location: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCouponCode: () => void;
  checkoutDetails: CheckoutDetails;
  setCheckoutDetails: React.Dispatch<React.SetStateAction<CheckoutDetails>>;
  submitOrder: () => { success: boolean; orderId: string };
  orderSuccessResult: { orderId: string; details: CheckoutDetails; total: number; itemsCount: number } | null;
  setOrderSuccessResult: (res: any) => void;
}

const initialFilterState: FilterState = {
  searchQuery: "",
  category: "",
  brand: "",
  priceRange: [0, 15000],
  rating: 0,
  tags: [],
  sortBy: "featured"
};

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Views and detail states
  const [currentView, setCurrentViewInternal] = useState<ViewType>("home");
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  // Cart & Wishlist persistence with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("almacen_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("almacen_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Global preferences
  const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");
  const [location, setLocation] = useState<string>("Cura Brochero, Córdoba");

  // Search experiences
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("almacen_search_history");
      return saved ? JSON.parse(saved) : ["almendras", "matcha", "sin gluten", "dátiles"];
    } catch {
      return [];
    }
  });

  // Filter experiences
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // checkout systems
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>({
    personal: { name: "", email: "", phone: "", dni: "" },
    address: { street: "", number: "", city: "", province: "CABA", zipCode: "" },
    shippingMethod: deliveryRates[1], // Express default
    paymentMethod: { type: "credit", cardName: "", cardNumber: "", cardExpiry: "", cardCvc: "" }
  });
  const [orderSuccessResult, setOrderSuccessResult] = useState<any>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem("almacen_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("almacen_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("almacen_search_history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // View controller wrapping: when moving views we trigger specific defaults
  const setCurrentView = (view: ViewType) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentViewInternal(view);
    // Reset active product detail to prevent persistent modals if we navigate directly
    if (view !== "shop" && view !== "home" && view !== "wishlist") {
      // Don't close immediately unless appropriate
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number, weight: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === weight
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [...prev, { product, quantity, selectedWeight: weight }];
    });
  };

  const removeFromCart = (productId: string, weight: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedWeight === weight))
    );
  };

  const updateCartQuantity = (productId: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedWeight === weight
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isProductInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Search operations
  const addToSearchHistory = (query: string) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q !== trimmed);
      return [trimmed, ...filtered].slice(0, 8); // Keep last 8 items
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  // Filter operations
  const resetFilters = () => {
    setFilterState(initialFilterState);
  };

  // Coupons
  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = discountCoupons.find((c) => c.code === cleanCode);

    if (!coupon) {
      return { success: false, message: "Código de cupón inexistente" };
    }

    // Calculating subtotal
    const subtotal = cart.reduce((acc, item) => {
      const price = item.product.prices[item.selectedWeight] || 0;
      return acc + price * item.quantity;
    }, 0);

    if (subtotal < coupon.minimumPurchase) {
      return {
        success: false,
        message: `Compra mínima requerida para este cupón: $${coupon.minimumPurchase}`
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Descuento de ${coupon.discountPercentage}% aplicado con éxito.` };
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
  };

  // Order Submissions
  const submitOrder = () => {
    const subtotal = cart.reduce((acc, item) => {
      const price = item.product.prices[item.selectedWeight] || 0;
      return acc + price * item.quantity;
    }, 0);
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discountPercentage) / 100 : 0;
    const shipping = checkoutDetails.shippingMethod ? checkoutDetails.shippingMethod.price : 0;
    const finalTotal = subtotal - discount + shipping;

    const orderId = `ALM-${Math.floor(100000 + Math.random() * 900000)}`;

    const summaryResult = {
      orderId,
      details: { ...checkoutDetails },
      total: finalTotal,
      itemsCount: cart.reduce((sum, i) => sum + i.quantity, 0)
    };

    setOrderSuccessResult(summaryResult);
    clearCart();
    return { success: true, orderId };
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeProductId,
        setActiveProductId,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isProductInWishlist,
        currency,
        setCurrency,
        location,
        setLocation,
        searchQuery,
        setSearchQuery,
        searchHistory,
        addToSearchHistory,
        clearSearchHistory,
        filterState,
        setFilterState,
        resetFilters,
        appliedCoupon,
        applyCouponCode,
        removeCouponCode,
        checkoutDetails,
        setCheckoutDetails,
        submitOrder,
        orderSuccessResult,
        setOrderSuccessResult
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
