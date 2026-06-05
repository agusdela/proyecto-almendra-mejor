/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { products, categories } from "./data/mockData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import ContactoSection from "./components/ContactoSection";
import CheckoutForm from "./components/CheckoutForm";
import Footer from "./components/Footer";
import { 
  ChevronDown, 
  Filter, 
  MessageCircle, 
  Sparkles,
  RefreshCw,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function StoreLayout() {
  const {
    currentView,
    setCurrentView,
    activeProductId,
    filterState,
    setFilterState,
    resetFilters,
    currency,
    wishlist
  } = useStore();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Currency Converter formatting
  const formattedPrice = (arsPrice: number) => {
    if (currency === "USD") {
      return `u$s ${(arsPrice / 1000).toFixed(2)}`;
    }
    return `$${arsPrice.toLocaleString("es-AR")}`;
  };

  // Filter Catalog logic for the Tienda (Shop)
  const filteredProducts = products.filter((p) => {
    // 1. Search filter
    if (filterState.searchQuery) {
      const q = filterState.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.categoryName.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat) return false;
    }

    // 2. Category filter
    if (filterState.category && p.category !== filterState.category) {
      return false;
    }

    // 3. Brand filter
    if (filterState.brand && p.brand !== filterState.brand) {
      return false;
    }

    // 4. Rating filter
    if (filterState.rating && p.rating < filterState.rating) {
      return false;
    }

    // 5. Price filter (use standard default weight price for range check)
    const price = p.prices[p.defaultWeight] || 0;
    if (price < filterState.priceRange[0] || price > filterState.priceRange[1]) {
      return false;
    }

    // 6. Tags check (Vegano, Sin TACC, Orgánico, Gourmet...)
    if (filterState.tags.length > 0) {
      const hasAllTags = filterState.tags.every((t) => p.tags.includes(t));
      if (!hasAllTags) return false;
    }

    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filterState.sortBy === "price-asc") {
      return (a.prices[a.defaultWeight] || 0) - (b.prices[b.defaultWeight] || 0);
    }
    if (filterState.sortBy === "price-desc") {
      return (b.prices[b.defaultWeight] || 0) - (a.prices[a.defaultWeight] || 0);
    }
    if (filterState.sortBy === "rating") {
      return b.rating - a.rating;
    }
    // Default is featured
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Pick unique brands to populate catalog filter checkbox
  const availableBrands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      
      {/* Header component */}
      <Header />

      {/* Main views rendering engine */}
      <main className="flex-grow">
                {/* UNIFIED SINGLE PAGE ENVIRONMENT (HOME, CATALOG, AND CONTACTS UNIFIED) */}
        {(currentView === "home" || currentView === "shop" || currentView === "contact") && (
          <div className="space-y-16 pb-16 animate-in fade-in duration-300">
            {/* 1. Hero Main Section Banner */}
            <div id="section-hero">
              <Hero />
            </div>

            {/* 2. Unified Products Catalog Section */}
            <div id="section-catalog" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-6 md:space-y-8 text-left">
              
              {/* Upper active catalog header and tags info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-850">
                    Nuestros Productos Saludables
                  </h2>
                  <p className="text-xs text-neutral-400 font-sans font-light">
                    Mostrando <strong>{sortedProducts.length}</strong> de <strong>{products.length}</strong> variedades naturales de alta calidad.
                  </p>
                </div>

                {/* Mobile Filter toggle and Sort controller */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    id="mobile-filter-toggle"
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="md:hidden flex items-center justify-center gap-1.5 p-3 rounded-xl border border-neutral-200 bg-white text-xs w-full text-center"
                  >
                    <Filter className="h-4 w-4 text-neutral-500" />
                    Filtrar Almacén
                  </button>

                  <div className="flex items-center gap-2 shrink-0 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-sans w-full md:w-auto">
                    <span className="text-neutral-400 hidden sm:inline">Ordenar por:</span>
                    <select
                      id="sort-select"
                      value={filterState.sortBy}
                      onChange={(e) => setFilterState(f => ({ ...f, sortBy: e.target.value }))}
                      className="outline-none py-0.5 text-neutral-700 bg-transparent font-medium cursor-pointer w-full sm:w-auto"
                    >
                      <option value="featured">Destacados Primero</option>
                      <option value="price-asc">Precio: Menor a Mayor</option>
                      <option value="price-desc">Precio: Mayor a Menor</option>
                      <option value="rating">Mayor Valoración ⭐</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Catalog Grid block divided in Filters (25%) and Products grid (75%) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                
                {/* Desktop Filters Pane (hidden on Mobile unless toggled) */}
                <aside className={`md:block space-y-6 ${mobileFiltersOpen ? "block" : "hidden"} bg-white md:bg-transparent p-5 md:p-0 rounded-2xl border md:border-transparent border-neutral-100 shadow-lg md:shadow-none`}>
                  
                  {/* Upper filters control and clear */}
                  <div className="flex justify-between items-center pb-2 border-b border-brand-cream md:border-neutral-200">
                    <h3 className="font-semibold text-neutral-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Filter className="h-4 w-4 text-brand-primary" /> Filtros Activos
                    </h3>
                    <button
                      id="clear-filters-btn"
                      onClick={resetFilters}
                      className="text-[10px] text-neutral-400 hover:text-brand-primary font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="h-3 w-3" /> Limpiar Todo
                    </button>
                  </div>

                  {/* 1. Category selector block */}
                  <div className="space-y-2 text-xs text-left text-neutral-600 pt-2 font-sans font-medium">
                    <p className="font-semibold text-neutral-800">Grupos de Alimentos:</p>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setFilterState((f) => ({ ...f, category: "" }))}
                        className={`w-full text-left p-2 rounded-xl transition-colors ${filterState.category === "" ? "bg-brand-primary text-white font-semibold" : "hover:bg-neutral-100"}`}
                      >
                        Todos los Productos
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setFilterState((f) => ({ ...f, category: cat.id }))}
                          className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between ${filterState.category === cat.id ? "bg-brand-primary text-white font-semibold" : "hover:bg-neutral-100"}`}
                        >
                          <span>{cat.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${filterState.category === cat.id ? "bg-white/20 text-white" : "bg-neutral-150 text-neutral-500"}`}>
                            {products.filter((p) => p.category === cat.id).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Special properties (Tags check) */}
                  <div className="space-y-2 text-xs text-left text-neutral-600 font-sans font-medium border-t border-brand-cream/80 pt-4">
                    <p className="font-semibold text-neutral-800">Propiedades Especiales:</p>
                    <div className="space-y-2">
                      {["Sin TACC", "Vegano", "Orgánico", "Oferta", "Gourmet"].map((tag) => {
                        const isChecked = filterState.tags.includes(tag);
                        return (
                          <label 
                            key={tag} 
                            className="flex items-center gap-2.5 cursor-pointer hover:bg-[#FAF8F5]/80 p-1.5 rounded-lg transition-colors select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const nextTags = isChecked
                                  ? filterState.tags.filter((t) => t !== tag)
                                  : [...filterState.tags, tag];
                                setFilterState((f) => ({ ...f, tags: nextTags }));
                              }}
                              className="accent-brand-primary h-4 w-4 shrink-0"
                            />
                            <span>{tag === "Sin TACC" ? "🌾 Sin TACC (Celiacos)" : tag === "Vegano" ? "🌱 Vegano (Plant-based)" : tag === "Orgánico" ? "🍁 Orgánico Certificado" : tag === "Gourmet" ? "🏺 Línea Gourmet" : "🉐 En Promoción"}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Brands list filtering */}
                  <div className="space-y-2 text-xs text-left space-y-2 text-neutral-650 border-t border-brand-cream/80 pt-4 font-sans font-medium">
                    <p className="font-semibold text-neutral-850">Marcas Productoras:</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      <button
                        onClick={() => setFilterState((f) => ({ ...f, brand: "" }))}
                        className={`w-full text-left p-1.5 rounded-lg text-xs leading-none transition-colors ${filterState.brand === "" ? "text-brand-primary font-bold" : "hover:text-brand-primary hover:bg-neutral-50"}`}
                      >
                        ✓ Todas las Marcas
                      </button>
                      {availableBrands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => setFilterState((f) => ({ ...f, brand }))}
                          className={`w-full text-left p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${filterState.brand === brand ? "text-brand-primary font-bold bg-brand-cream/50" : "hover:text-brand-primary hover:bg-neutral-50"}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${filterState.brand === brand ? "bg-brand-primary" : "bg-transparent"}`} />
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Price range sliding interval display */}
                  <div className="space-y-3.5 text-xs text-left border-t border-brand-cream/80 pt-4 font-sans font-medium">
                    <div className="flex justify-between font-semibold text-neutral-800">
                      <span>Intervalo de Precio:</span>
                      <span className="font-mono text-brand-primary">{formattedPrice(filterState.priceRange[1])}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={15000}
                      step={500}
                      value={filterState.priceRange[1]}
                      onChange={(e) => {
                        const maxVal = parseInt(e.target.value);
                        setFilterState((f) => ({ ...f, priceRange: [f.priceRange[0], maxVal] }));
                      }}
                      className="w-full accent-brand-primary cursor-pointer h-1.5 bg-neutral-200 rounded-lg outline-none"
                      id="price-range-slider"
                    />
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>$0 ARS</span>
                      <span>$15.000 ARS</span>
                    </div>
                  </div>

                  <button
                    id="mobile-filter-close"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="md:hidden w-full bg-brand-primary text-white text-xs font-semibold py-3.5 rounded-xl uppercase block"
                  >
                    Ver {sortedProducts.length} Productos
                  </button>

                </aside>

                {/* RIGHT Catalogs catalog Grid list (span 3) */}
                <div className="lg:col-span-3 font-sans">
                  {sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.map((p) => (
                        <div key={p.id} className="flex w-full" id={`product-${p.id}`}>
                          <ProductCard product={p} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 max-w-md mx-auto space-y-4">
                      <p className="text-2xl">🌾</p>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-neutral-800 text-sm">No encontramos resultados exactos</h4>
                        <p className="text-xs text-neutral-400 font-light">Probá modificando los selectores de búsqueda o limpiando los filtros activos.</p>
                      </div>
                      <button
                        id="reset-filter-query"
                        onClick={resetFilters}
                        className="bg-brand-primary text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider"
                      >
                        Limpiar Filtros
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* 3. Contacto Section */}
            <div id="section-contact" className="scroll-mt-20">
              <ContactoSection />
            </div>

          </div>
        )}

        {/* VIEW 7: CHECKOUT & SHOPPING CART VIEW */}
        {currentView === "checkout" && <CheckoutForm />}

      </main>

      {/* FOOTER element */}
      <Footer />

      {/* Dynamic Product detail modal card sheet */}
      {activeProductId ? <ProductDetailModal /> : null}

      {/* Floating interactive WhatsApp bubble of support */}
      <a
        id="whatsapp-floater"
        href="https://wa.me/5493544635404?text=Hola!%20Contacto%20desde%20la%20tienda%20online.%20Me%20interesa%20hacer%20un%20pedido%20saludable."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] border border-white hover:scale-110 active:scale-95 transition-all text-center flex items-center justify-center group"
        title="Consultas por Whatsapp"
      >
        <MessageCircle className="h-6 w-6 stroke-[2]" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2">
          WhatsApp de Guardia (Online)
        </span>
      </a>

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreLayout />
    </StoreProvider>
  );
}
