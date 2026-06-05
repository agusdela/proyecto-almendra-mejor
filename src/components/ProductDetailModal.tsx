/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { products, customerReviews } from "../data/mockData";
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Minus, 
  Plus, 
  ShoppingBag,
  Info
} from "lucide-react";
import { motion } from "motion/react";

export default function ProductDetailModal() {
  const {
    activeProductId,
    setActiveProductId,
    addToCart,
    toggleWishlist,
    isProductInWishlist,
    currency
  } = useStore();

  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"desc" | "ingr" | "nutrition">("desc");
  const [isZoomed, setIsZoomed] = useState(false);

  if (!activeProductId) return null;

  const product = products.find((p) => p.id === activeProductId);
  if (!product) return null;

  // Set default weight if not initialized
  if (!selectedWeight) {
    setSelectedWeight(product.defaultWeight);
  }

  const isFavorited = isProductInWishlist(product.id);
  const currentPrice = product.prices[selectedWeight] || 0;
  const originalPrice = product.originalPrices?.[selectedWeight];
  const hasDiscount = !!originalPrice && originalPrice > currentPrice;

  // Reviews specific to this product name
  const filteredReviews = customerReviews.filter(
    (rev) => rev.productName === product.name
  );

  // If no specific reviews, fetch 3 general reviews as illustrative feedback
  const displayReviews = filteredReviews.length > 0 
    ? filteredReviews 
    : customerReviews.slice(0, 3);

  // Related products under same category
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedWeight);
    setActiveProductId(null); // Close modal
    // Reset state
    setQuantity(1);
    setSelectedWeight("");
  };

  const formattedPrice = (arsPrice: number) => {
    if (currency === "USD") {
      return `u$s ${(arsPrice / 1000).toFixed(2)}`;
    }
    return `$${arsPrice.toLocaleString("es-AR")}`;
  };

  const handleWeightChange = (weight: string) => {
    setSelectedWeight(weight);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => { setActiveProductId(null); setSelectedWeight(""); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh]"
      >
        {/* Close Button badge */}
        <button
          onClick={() => { setActiveProductId(null); setSelectedWeight(""); }}
          className="absolute top-4 right-4 z-20 bg-brand-cream/80 hover:bg-neutral-200 p-2.5 rounded-full text-neutral-800 hover:scale-110 active:scale-95 transition-all shadow"
          title="Cerrar modal"
          id="close-detail-modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable contents box */}
        <div className="overflow-y-auto max-h-[90vh] p-6 sm:p-8 md:p-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Left Column: Media Gallery with zoom */}
            <div className="space-y-4">
              <div 
                className="relative h-64 sm:h-80 md:h-[400px] w-full rounded-2xl overflow-hidden bg-brand-cream cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? "scale-150 cursor-zoom-out" : "scale-100"}`}
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute bottom-4 left-4 bg-black/50 text-white text-[11px] px-3 py-1.5 rounded-lg pointer-events-none">
                  {isZoomed ? "Hacé click para el zoom anterior" : "Hacé click para ver con zoom"}
                </div>
              </div>

              {/* Guarantees signals list */}
              <div className="grid grid-cols-2 gap-3.5 bg-brand-cream/40 p-4 rounded-xl text-neutral-700">
                <div className="flex items-center gap-2 text-xs">
                  <Truck className="h-4 w-4 text-brand-primary shrink-0" />
                  <span>Envíos rápidos a todo el país</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="h-4 w-4 text-brand-primary shrink-0" />
                  <span>Calidad de origen avalada</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interaction, pricing & specs */}
            <div className="text-left space-y-6">
              
              {/* Category, Title and rating banner */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-widest text-brand-secondary">
                  {product.categoryName} • Brand {product.brand}
                </span>
                
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-800 leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4.5 w-4.5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`} 
                      />
                    ))}
                    <span className="text-sm font-semibold ml-1.5 text-neutral-700">{product.rating}</span>
                  </div>
                  <span className="text-neutral-400">•</span>
                  <button className="text-xs text-brand-primary font-medium hover:underline">
                    {product.reviewCount} Reseñas de clientes
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-100 w-full" />

              {/* Price section with weights */}
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <span className="font-display font-bold text-3xl text-brand-primary leading-none">
                    {formattedPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-neutral-400 line-through text-lg leading-none font-medium">
                      {formattedPrice(originalPrice)}
                    </span>
                  )}
                </div>

                {/* Weight Option Selection panel */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                    Seleccionar opción de peso / formato
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.weights.map((w) => (
                      <button
                        key={w}
                        onClick={() => handleWeightChange(w)}
                        className={`px-4 py-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${selectedWeight === w ? "bg-brand-primary text-white border-brand-primary shadow-sm" : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"}`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock status indicator */}
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`} />
                  <span className="text-xs text-neutral-500 font-medium">
                    {product.stock > 10 ? `Stock Disponible (${product.stock} unidades)` : "¡Últimas unidades disponibles!"}
                  </span>
                </div>
              </div>

              {/* Inputs buy and wishlist toggle */}
              <div className="flex flex-wrap gap-4 pt-2">
                {/* Quantity input counter */}
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-4 font-mono font-bold text-sm text-neutral-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Main Buy action */}
                <button
                  id="modal-add-to-cart"
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-primary p-3.5 rounded-xl text-white font-semibold text-sm hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  Agregar al Carrito • {formattedPrice(currentPrice * quantity)}
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Tabs Section: Detailed descriptions, Ingredients and Nutrition labels */}
          <div className="mt-12 text-left bg-neutral-50/50 rounded-2xl p-6 border border-neutral-100">
            <div className="flex border-b border-neutral-200 gap-6 overflow-x-auto mb-6">
              <button
                onClick={() => setActiveTab("desc")}
                className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === "desc" ? "text-brand-primary" : "text-neutral-500 hover:text-neutral-800"}`}
              >
                Descripción del Almacén
                {activeTab === "desc" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />}
              </button>
              <button
                onClick={() => setActiveTab("ingr")}
                className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === "ingr" ? "text-brand-primary" : "text-neutral-500 hover:text-neutral-800"}`}
              >
                Ingredientes Puros
                {activeTab === "ingr" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />}
              </button>
              <button
                onClick={() => setActiveTab("nutrition")}
                className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === "nutrition" ? "text-brand-primary" : "text-neutral-500 hover:text-neutral-800"}`}
              >
                Tabla Nutricional
                {activeTab === "nutrition" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />}
              </button>
            </div>

            {/* Tap Values layout */}
            <div className="min-h-[140px] text-sm text-neutral-600 leading-relaxed font-sans">
              
              {activeTab === "desc" && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <div className="flex flex-wrap gap-2 pt-3">
                    {product.tags.map(t => (
                      <span key={t} className="bg-brand-primary/10 text-brand-primary text-xs px-2.5 py-1 rounded-full font-medium">
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "ingr" && (
                <div className="space-y-4">
                  <p className="font-semibold text-neutral-800">Composición de ingredientes:</p>
                  <p className="italic">"{product.ingredients}"</p>
                  <div className="bg-amber-500/5 text-amber-800 p-3.5 rounded-xl flex items-start gap-2.5 border border-amber-300/25">
                    <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider">Aviso de alérgenos:</h4>
                      <p className="text-[11px] leading-snug mt-0.5">Envasado en instalaciones que manipulan frutos secos, sésamo, lino y mijo. Conservar hermético.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "nutrition" && (
                <div className="space-y-4">
                  <p className="text-xs text-neutral-400 font-semibold mb-2">Porción sugerida: {product.nutritionFacts.servingSize}</p>
                  <div className="max-w-md border-2 border-neutral-900 p-4 font-mono text-neutral-850 bg-white">
                    <h3 className="font-sans font-bold text-lg border-b-4 border-neutral-900 pb-1">INFORMACIÓN NUTRICIONAL</h3>
                    <div className="space-y-1 pt-1.5 text-xs">
                      <div className="flex justify-between font-bold border-b border-neutral-900 pb-1">
                        <span>Cantidades por Porción</span>
                        <span>% VD*</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-300 py-1">
                        <span>Calorías (Valor Energético)</span>
                        <span className="font-bold">{product.nutritionFacts.calories}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-300 py-1 pl-4">
                        <span>Carbohidratos totales</span>
                        <span className="font-bold">{product.nutritionFacts.carbs}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-300 py-1 pl-4">
                        <span>Proteínas</span>
                        <span className="font-bold">{product.nutritionFacts.protein}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-300 py-1 pl-4">
                        <span>Grasas totales</span>
                        <span className="font-bold">{product.nutritionFacts.fats}</span>
                      </div>
                      <div className="flex justify-between border-b-2 border-neutral-950/80 py-1">
                        <span>Sodio</span>
                        <span className="font-bold">{product.nutritionFacts.sodium}</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-neutral-400 leading-snug pt-3 font-sans">* Valores Diarios con base a una dieta de 2.000 kcal u 8.400 kJ. Sus valores diarios pueden ser mayores o menores dependiendo de sus necesidades energéticas.</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Real Customer Opiniones Section */}
          <div className="mt-12 text-left space-y-4">
            <h3 className="font-display font-semibold text-lg text-neutral-800">
              Opiniones de Clientes (Sugeridas para {product.name})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayReviews.map((rev) => (
                <div key={rev.id} className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm space-y-2 text-xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`} 
                        />
                      ))}
                    </div>
                    <p className="italic text-neutral-600">"{rev.text}"</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-neutral-50 pt-2 text-[10px] text-neutral-400">
                    <span className="font-semibold">{rev.clientName}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related items carousel */}
          {related.length > 0 && (
            <div className="mt-14 text-left border-t border-brand-cream/50 pt-8 space-y-4">
              <h3 className="font-display font-semibold text-lg text-neutral-850">
                Productos Relacionados que podrían interesarte
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((item) => {
                  const itemPrice = item.prices[item.defaultWeight];
                  return (
                    <div
                      key={item.id}
                      onClick={() => { setActiveProductId(item.id); setSelectedWeight(item.defaultWeight); }}
                      className="cursor-pointer group bg-brand-cream/30 hover:bg-white rounded-xl p-3 border border-neutral-100 shadow-sm hover:shadow-md transition-all text-xs text-left text-neutral-750"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-full object-cover rounded-lg bg-neutral-100 mb-2 group-hover:scale-105 duration-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400">{item.brand}</span>
                      <h4 className="font-semibold truncate text-[11px] h-4 text-neutral-800 mb-1">{item.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-brand-primary font-bold">{formattedPrice(itemPrice)}</span>
                        <span className="text-[9px] text-brand-secondary font-medium">Ver más</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
