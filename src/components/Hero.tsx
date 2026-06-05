/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { ChevronRight, ShieldCheck, Truck, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Hero() {
  const { setCurrentView, setFilterState } = useStore();

  const handlePrimaryClick = () => {
    setFilterState(f => ({ ...f, category: "", searchQuery: "" }));
    setCurrentView("shop");
  };

  const handleSecondaryClick = () => {
    setCurrentView("contact");
  };

  return (
    <section id="hero-banner" className="relative w-full overflow-hidden bg-brand-dark text-white">
      {/* Unique Hero Banner Cover */}
      <div className="relative h-[480px] sm:h-[540px] md:h-[620px] w-full flex items-center justify-center">
        
        {/* Sole Hero Background Organic Gradient & Decorative elements instead of heavy image */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1c2c22] via-[#24362a] to-[#152019] z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-12 right-24 w-72 h-72 bg-brand-secondary/5 rounded-full blur-[90px] pointer-events-none" />
        </div>

        {/* Content Panel Box */}
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Badge element */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-primary/95 text-brand-beige text-xs font-semibold uppercase tracking-wider mb-5 border border-brand-secondary/35">
              <Sparkles className="h-3 w-3 text-brand-beige" />
              100% Orgánicos & Naturales
            </span>

            {/* Title display - Almendra Almacén Natural */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-brand-beige tracking-tight leading-tight mb-4">
              Almendra <span className="text-brand-secondary block sm:inline">Almacén Natural</span>
            </h1>

            {/* Description */}
            <p className="font-sans text-brand-cream/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
              Tu rincón saludable en Cura Brochero, Traslasierra. Selección premium de frutos secos cosechados con amor, semillas orgánicas y superalimentos para tu bienestar diario.
            </p>

            {/* Buttons Call-to-action */}
            <div className="flex flex-wrap justify-center gap-3.5 sm:gap-4">
              <button
                id="hero-primary-cta"
                onClick={handlePrimaryClick}
                className="px-6 py-3.5 bg-brand-primary text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-full hover:bg-brand-secondary transition-all-custom cursor-pointer shadow-lg shadow-brand-primary/20 flex items-center gap-2 group hover:scale-[1.03] active:scale-95"
              >
                Ver Catálogo Completo
                <ChevronRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="hero-secondary-cta"
                onClick={handleSecondaryClick}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all-custom cursor-pointer hover:scale-[1.03] active:scale-95"
              >
                Contacto Directo
              </button>
            </div>



          </motion.div>
        </div>
      </div>

      {/* Trust guarantees footer band */}
      <div className="w-full bg-brand-cream/10 border-t border-white/5 py-4 lg:py-6 px-4">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8 justify-items-center text-center">
          
          <div className="flex items-center gap-3 max-w-[280px]">
            <div className="h-10 w-10 shrink-0 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20">
              <Truck className="h-5 w-5 text-brand-secondary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-brand-beige">Envíos Rápidos</h3>
              <p className="text-neutral-400 text-[11px] sm:text-xs">Llegamos a todo el país. Gratis en compras mayores a $25.000.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 max-w-[280px]">
            <div className="h-10 w-10 shrink-0 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20">
              <ShieldCheck className="h-5 w-5 text-brand-secondary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-brand-beige">100% Certificados</h3>
              <p className="text-neutral-400 text-[11px] sm:text-xs">Alimentos naturales seleccionados con aval ANMAT y sin químicos.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 max-w-[280px]">
            <div className="h-10 w-10 shrink-0 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20">
              <AlertCircle className="h-5 w-5 text-brand-secondary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-brand-beige">Compra Protegida</h3>
              <p className="text-neutral-400 text-[11px] sm:text-xs">Garantía de frescura. Devolución directa de tu dinero si algo falla.</p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
