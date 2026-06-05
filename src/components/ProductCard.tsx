/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";
import { Heart, Star, ShoppingCart, Percent, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    addToCart,
    toggleWishlist,
    isProductInWishlist,
    currency,
    setActiveProductId
  } = useStore();

  // Selected weight state directly in-card (very user responsive!)
  const [selectedWeight, setSelectedWeight] = useState(product.defaultWeight);
  const [isAddedEffect, setIsAddedEffect] = useState(false);

  // Values calculation
  const currentPrice = product.prices[selectedWeight] || 0;
  const originalPrice = product.originalPrices?.[selectedWeight];
  const hasDiscount = !!originalPrice && originalPrice > currentPrice;

  // Calculamos el porcentaje exacto de rebaja
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedWeight);
    setIsAddedEffect(true);
    setTimeout(() => {
      setIsAddedEffect(false);
    }, 1500);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const formatPrice = (arsPrice: number) => {
    if (currency === "USD") {
      return `u$s ${(arsPrice / 1000).toFixed(2)}`;
    }
    return `$${arsPrice.toLocaleString("es-AR")}`;
  };

  const isFavorited = isProductInWishlist(product.id);

  return (
    <motion.article 
      layout
      id={`product-${product.id}`}
      onClick={() => setActiveProductId(product.id)}
      className="group relative bg-white rounded-3xl border border-brand-primary/10 shadow-sm hover:shadow-lg hover:border-brand-primary/25 transition-all-custom overflow-hidden flex flex-col justify-between cursor-pointer w-full"
    >
      
      {/* Upper Media Section */}
      <div className="relative h-44 sm:h-48 w-full bg-brand-cream overflow-hidden">
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {hasDiscount && (
            <span className="bg-red-500 font-display text-white font-bold text-[10px] px-2 py-1 rounded-full flex items-center gap-0.5 shadow-sm uppercase tracking-wider animate-pulse">
              <Percent className="h-3 w-3" />
              {discountPercentage}% OFF
            </span>
          )}
          {product.tags.includes("Orgánico") && (
            <span className="bg-brand-primary text-brand-beige font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
              Orgánico
            </span>
          )}
          {product.tags.includes("Sin TACC") && (
            <span className="bg-amber-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
              Sin TACC
            </span>
          )}
        </div>


        {/* Product image with mouseover dynamic zoom */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Soft quick-view overlay text */}
        <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-brand-primary/90 text-white font-display text-[11px] font-semibold tracking-wider uppercase px-4 py-2 rounded-full shadow-md">
            Ver Detalles
          </span>
        </div>

      </div>

      {/* Detail Context Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-left">
        <div className="space-y-1.5">
          {/* Brand and tags line */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest leading-none">
              {product.brand}
            </span>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-neutral-700">{product.rating}</span>
            </div>
          </div>

          {/* Title and descriptions summary */}
          <h3 className="font-display font-semibold text-neutral-800 text-sm leading-snug group-hover:text-brand-primary duration-200 line-clamp-2 h-10">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 h-4">
            {product.description}
          </p>

          {/* Interactive Weight Selectors Tab */}
          <div className="py-2">
            <div onClick={(e) => e.stopPropagation()} className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
              {product.weights.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`text-[10px] shrink-0 font-medium px-2 py-1 rounded-md border cursor-pointer transition-all ${selectedWeight === w ? "bg-brand-primary text-white border-brand-primary font-semibold" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border-transparent"}`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing structure & Buy interface */}
        <div className="mt-4 pt-3 border-t border-brand-cream/50 flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-neutral-400 font-medium line-through text-[11px] leading-tight">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-brand-primary font-display font-bold text-base leading-none">
              {formatPrice(currentPrice)}
            </span>
          </div>

          {/* Direct Buy button with dynamic micro-animation */}
          <button
            id={`add-btn-${product.id}`}
            onClick={handleAddToCart}
            className={`cursor-pointer px-3.5 py-2.5 rounded-xl border flex items-center gap-1.5 transition-all duration-200 relative overflow-hidden ${isAddedEffect ? "bg-emerald-500 border-emerald-500 text-white font-semibold" : "bg-brand-primary hover:bg-brand-secondary text-white border-transparent"}`}
            aria-label="Agregar al carrito"
          >
            {isAddedEffect ? (
              <span className="text-xs flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                ¡Agregado!
              </span>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs font-semibold">Agregar</span>
              </>
            )}
          </button>
        </div>

      </div>

    </motion.article>
  );
}
