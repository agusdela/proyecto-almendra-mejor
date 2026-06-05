/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useStore, ViewType } from "../context/StoreContext";
import { products, categories } from "../data/mockData";
import logoImg from "../assets/images/almendra_logo_clear_1780680079584.png";
import { 
  MapPin, 
  ChevronDown, 
  Search, 
  Heart, 
  ShoppingBag, 
  X, 
  RotateCcw, 
  TrendingUp, 
  Sparkles,
  Menu,
  Globe
} from "lucide-react";

export default function Header() {
  const {
    currentView,
    setCurrentView,
    cart,
    wishlist,
    currency,
    setCurrency,
    location,
    setLocation,
    searchQuery,
    setSearchQuery,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    setFilterState
  } = useStore();

  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close custom drop-downs when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Total quantity calculation for bag label
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Shipping locations mock list
  const locations = [
    "Cura Brochero, Córdoba",
    "Córdoba Capital",
    "Mina Clavero, Córdoba",
    "Villa Dolores, Córdoba",
    "San Alberto, Córdoba",
    "Traslasierra, Córdoba",
    "Envíos a todo el País"
  ];

  // Smart Query filter
  const filteredSuggestions = searchQuery.trim() !== ""
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery);
      setFilterState(prev => ({ ...prev, searchQuery }));
      setCurrentView("shop");
      setSearchFocused(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    addToSearchHistory(query);
    setFilterState(prev => ({ ...prev, searchQuery: query }));
    setCurrentView("shop");
    setSearchFocused(false);
  };

  const handleProductSuggestionBuy = (productId: string) => {
    setSearchFocused(false);
    setCurrentView("shop");
    // Under context, we can set this product as active for details
    setTimeout(() => {
      const activeElement = document.getElementById(`product-${productId}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  // Quick navigation helpers
  const navigateToCategory = (catId: string) => {
    setFilterState(prev => ({ ...prev, category: catId, searchQuery: "" }));
    setSearchQuery("");
    setCurrentView("shop");
    setMobileMenuOpen(false);
  };

  const formattedPrice = (arsPrice: number) => {
    if (currency === "USD") {
      return `u$s ${(arsPrice / 1000).toFixed(2)}`;
    }
    return `$${arsPrice.toLocaleString("es-AR")}`;
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-brand-cream/80 transition-all duration-300">

      {/* Main utilities section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentView("home"); setMobileMenuOpen(false); }}>
            <img 
              src={logoImg} 
              alt="Almendra Almacén Natural Logo" 
              className="h-10 w-10 rounded-full object-cover shadow-sm bg-white border border-brand-cream"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight leading-none text-brand-primary">
                ALMENDRA
              </span>
              <span className="font-display font-medium text-[9px] tracking-[0.15em] leading-none text-brand-secondary mt-0.5">
                ALMACÉN NATURAL
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 text-sm font-medium">
            <button 
              onClick={() => {
                setCurrentView("home");
                document.getElementById("section-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }} 
              className={`pb-1 cursor-pointer transition-colors border-b-2 ${currentView === "home" ? "border-brand-primary text-brand-primary font-semibold" : "border-transparent text-neutral-600 hover:text-brand-primary"}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => { 
                setFilterState(f => ({ ...f, category: "", searchQuery: "" })); 
                setSearchQuery(""); 
                setCurrentView("shop");
                setTimeout(() => {
                  document.getElementById("section-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }} 
              className={`pb-1 cursor-pointer transition-colors border-b-2 ${currentView === "shop" ? "border-brand-primary text-brand-primary font-semibold" : "border-transparent text-neutral-600 hover:text-brand-primary"}`}
            >
              Tienda
            </button>
            <button 
              onClick={() => {
                setCurrentView("contact");
                setTimeout(() => {
                  document.getElementById("section-contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }} 
              className={`pb-1 cursor-pointer transition-colors border-b-2 ${currentView === "contact" ? "border-brand-primary text-brand-primary font-semibold" : "border-transparent text-neutral-600 hover:text-brand-primary"}`}
            >
              Contacto
            </button>
          </nav>

          {/* Intuitively Structured Autocomplete Search bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Buscar almendras, matcha, sin TACC..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-4 pr-10 py-2 rounded-full bg-brand-cream hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-brand-secondary/40 focus:ring-2 focus:ring-brand-secondary/10 outline-none transition-all duration-200"
              />
              {searchQuery ? (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-primary transition-colors"
                id="search-btn"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Smart Search Dashboard Overlay */}
            {searchFocused && (
              <div id="search-autocomplete-overlay" className="absolute top-12 left-0 right-0 w-full bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                
                {/* 1. Quick suggestion matches */}
                {searchQuery.trim() !== "" ? (
                  <div className="p-4 border-b border-neutral-100">
                    <h4 className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-brand-secondary" /> Coincidencias en Almacén
                    </h4>
                    {filteredSuggestions.length > 0 ? (
                      <div className="space-y-2">
                        {filteredSuggestions.map((prod) => (
                          <div 
                            key={prod.id} 
                            onClick={() => handleSuggestionClick(prod.name)}
                            className="flex items-center gap-3 p-2 hover:bg-brand-cream/80 rounded-xl cursor-pointer transition-colors"
                          >
                            <img 
                              src={prod.image} 
                              alt={prod.name} 
                              className="h-10 w-10 rounded-lg object-cover bg-neutral-100"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-neutral-800 truncate">{prod.name}</p>
                              <p className="text-[10px] text-neutral-400">{prod.brand} • {prod.defaultWeight}</p>
                            </div>
                            <span className="text-xs font-semibold text-brand-primary">
                              {formattedPrice(prod.prices[prod.defaultWeight])}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 py-2 text-center">No encontramos coincidencias exactas para tu búsqueda.</p>
                    )}
                  </div>
                ) : null}

                {/* 2. Search History and Trends */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                      <RotateCcw className="h-3.5 w-3.5 text-neutral-400" /> Búsquedas recientes
                    </h4>
                    {searchHistory.length > 0 && (
                      <button 
                        onClick={clearSearchHistory}
                        className="text-[10px] text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        Limpiar todo
                      </button>
                    )}
                  </div>
                  
                  {searchHistory.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {searchHistory.map((historyQuery, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(historyQuery)}
                          className="text-xs bg-brand-cream/50 text-neutral-700 hover:bg-brand-cream hover:text-brand-primary px-3 py-1.5 rounded-full border border-neutral-100 flex items-center gap-1.5 transition-all text-left"
                        >
                          <Search className="h-3 w-3 text-neutral-400" />
                          {historyQuery}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 mb-4 italic">No tienes búsquedas previas.</p>
                  )}

                  {/* 3. Recommended instant categories */}
                  <div className="border-t border-neutral-100 pt-3">
                    <h4 className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-brand-secondary" /> Categorías populares
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {categories.slice(0, 4).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => navigateToCategory(cat.id)}
                          className="text-xs text-left text-neutral-700 hover:text-brand-primary p-2 rounded-xl hover:bg-brand-cream/50 transition-colors flex items-center gap-2 border border-transparent hover:border-neutral-100"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="bg-brand-cream p-2 px-4 text-center text-[10px] text-neutral-400 border-t border-neutral-100">
                  Presioná Enter para buscar el listado completo de productos.
                </div>
              </div>
            )}
          </div>

          {/* Right section widgets: Location, Currency, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-4 font-medium text-sm">
            
            {/* Location Selector */}
            <div ref={locationRef} className="relative hidden sm:block">
              <button
                id="location-selector"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1 text-xs text-neutral-600 hover:text-brand-primary py-1 px-2 rounded-lg hover:bg-brand-cream/50 transition-all cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                <span className="max-w-[90px] truncate">{location}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {showLocationDropdown && (
                <div className="absolute right-0 top-8 bg-white shadow-xl rounded-xl border border-neutral-100 py-1.5 w-48 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-[10px] text-neutral-400 uppercase tracking-widest border-b border-neutral-50 mb-1">
                    Elegí tu sucursal / zona
                  </div>
                  {locations.map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => { setLocation(loc); setShowLocationDropdown(false); }}
                      className={`w-full text-left text-xs px-3 py-2 hover:bg-brand-cream hover:text-brand-primary transition-colors flex items-center gap-1.5 ${location === loc ? "text-brand-primary font-semibold" : "text-neutral-700"}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${location === loc ? "bg-brand-primary" : "bg-transparent"}`} />
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div ref={currencyRef} className="relative">
              <button
                id="currency-selector"
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 text-xs text-neutral-600 hover:text-brand-primary py-1 px-2 rounded-lg hover:bg-brand-cream/50 transition-all cursor-pointer font-mono"
              >
                <Globe className="h-3.5 w-3.5 text-brand-secondary" />
                <span>{currency}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {showCurrencyDropdown && (
                <div className="absolute right-0 top-8 bg-white shadow-xl rounded-xl border border-neutral-100 py-1.5 w-32 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => { setCurrency("ARS"); setShowCurrencyDropdown(false); }}
                    className={`w-full text-left text-xs px-3 py-2 hover:bg-brand-cream hover:text-brand-primary transition-colors font-mono font-semibold ${currency === "ARS" ? "text-brand-primary bg-brand-cream/30" : "text-neutral-700"}`}
                  >
                    $ ARS (Arg)
                  </button>
                  <button
                    onClick={() => { setCurrency("USD"); setShowCurrencyDropdown(false); }}
                    className={`w-full text-left text-xs px-3 py-2 hover:bg-brand-cream hover:text-brand-primary transition-colors font-mono font-semibold ${currency === "USD" ? "text-brand-primary bg-brand-cream/30" : "text-neutral-700"}`}
                  >
                    u$s USD (Usa)
                  </button>
                </div>
              )}
            </div>

            {/* Cart Selector (Direct checkout view or lateral drawers) */}
            <button
              id="cart-btn"
              onClick={() => setCurrentView("checkout")}
              className="p-2 bg-brand-primary text-white hover:bg-brand-secondary rounded-full flex items-center justify-center relative cursor-pointer shadow-md shadow-brand-primary/25 transition-all hover:scale-105 active:scale-95"
              title="Carrito de Compras"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-beige border border-brand-primary text-brand-primary font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-neutral-600 hover:text-brand-primary rounded-lg hover:bg-brand-cream/50 transition-colors"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>

          </div>
        </div>
      </div>

      {/* Mobile search bar (under header for small devices) */}
      <div className="md:hidden px-4 pb-3 pt-1 border-b border-brand-cream/50">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            id="mobile-search-input"
            type="text"
            placeholder="Buscar en el almacén..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-3 pr-8 py-2 rounded-xl bg-brand-cream outline-none focus:bg-white border border-transparent focus:border-brand-secondary/40 transition-all"
          />
          <button 
            type="submit" 
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

      {/* Mobile Menu Panel Drawer Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-neutral-100 shadow-2xl z-40 py-4 px-6 space-y-4 animate-in fade-in slide-in-from-top-1">
          <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
            <button 
              onClick={() => { 
                setCurrentView("home"); 
                setMobileMenuOpen(false); 
                document.getElementById("section-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-brand-cream text-neutral-700 hover:text-brand-primary"
            >
              🌾 Inicio
            </button>
            <button 
              onClick={() => { 
                setFilterState(f => ({ ...f, category: "" })); 
                setSearchQuery(""); 
                setCurrentView("shop"); 
                setMobileMenuOpen(false); 
                setTimeout(() => {
                  document.getElementById("section-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-brand-cream text-neutral-700 hover:text-brand-primary"
            >
              🛒 Tienda Completa
            </button>
            <button 
              onClick={() => { 
                setCurrentView("contact"); 
                setMobileMenuOpen(false); 
                setTimeout(() => {
                  document.getElementById("section-contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-brand-cream text-neutral-700 hover:text-brand-primary col-span-2"
            >
              📞 Contacto & WhatsApp
            </button>
          </div>
          
          <div className="border-t border-brand-cream/50 pt-3">
            <p className="text-[10px] text-neutral-400 uppercase font-semibold mb-2">Comprá por categorías</p>
            <div className="grid grid-cols-3 gap-2">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigateToCategory(cat.id)}
                  className="text-[11px] py-1 px-2 border border-neutral-100 rounded-lg text-neutral-600 truncate bg-brand-cream/30 text-center uppercase text-[9px] hover:bg-brand-cream"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
