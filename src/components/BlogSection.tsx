/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { blogArticles } from "../data/mockData";
import { BlogArticle } from "../types";
import { BookOpen, User, Calendar, Clock, X, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const categories = ["Todas", "Alimentación saludable", "Recetas", "Nutrición", "Bienestar", "Vida sana"];

  const filteredArticles = selectedCategory === "Todas"
    ? blogArticles
    : blogArticles.filter(art => art.category === selectedCategory);

  const activeArticle = blogArticles.find(art => art.id === activeArticleId);

  return (
    <section id="blog-section" className="py-12 bg-white text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Content */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-brand-secondary font-bold">
            🌿 Bienestar, Recetas & Alimentación Consciente
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-neutral-800">
            Nuestro Blog Natural
          </h2>
          <p className="text-sm text-neutral-500 font-light">
            Artículos explicativos e inspiradores redactados por nuestro equipo de biólogos, nutricionistas e invitados culinarios chefs.
          </p>
        </div>

        {/* Dynamic Category Filtering Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 justify-start sm:justify-center no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs whitespace-nowrap px-4 py-2.5 rounded-full border cursor-pointer font-medium transition-all ${selectedCategory === cat ? "bg-brand-primary text-white border-brand-primary shadow-sm" : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid layout */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredArticles.map((article) => (
            <motion.article
              layout
              key={article.id}
              onClick={() => { setActiveArticleId(article.id); window.scrollTo({ top: 300, behavior: "smooth" }); }}
              className="group bg-brand-cream/30 hover:bg-brand-cream/60 rounded-2xl border border-neutral-100/70 p-4 shadow-sm hover:shadow-xl transition-all-custom cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Article photo */}
                <div className="h-48 w-full rounded-xl overflow-hidden bg-brand-cream relative">
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow text-brand-primary font-semibold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {article.category}
                  </span>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Date and time badges */}
                <div className="flex items-center gap-3.5 text-[11px] text-neutral-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                {/* Title and summary */}
                <h3 className="font-display font-semibold text-neutral-800 text-lg leading-snug group-hover:text-brand-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  {article.summary}
                </p>
              </div>

              {/* Bottom author and CTA */}
              <div className="mt-6 pt-3 border-t border-brand-cream/60 flex items-center justify-between text-xs">
                <span className="text-neutral-550 font-medium flex items-center gap-1.5 text-[11px]">
                  <User className="h-3.5 w-3.5 text-brand-secondary" />
                  {article.author.split(" ")[0]} ...
                </span>
                <span className="text-brand-primary font-bold group-hover:translate-x-1.5 duration-200 flex items-center gap-1">
                  Leer artículo <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Lead Capture Newsletter Box */}
        <div className="mt-16 bg-brand-primary text-brand-beige rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle natural backgrounds textures overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-brand-gray-dark/25 pointer-events-none" />
          
          <div className="max-w-md z-10 text-left space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-beige/80">
              Suscripción saludable
            </span>
            <h3 className="font-display font-bold text-2xl text-white">
              Súmate a nuestro Club Natural
            </h3>
            <p className="text-xs text-brand-cream/80 font-light leading-relaxed">
              Recibí recetas exclusivas gratuitas, guías científicas sobre micro-nutrientes y cupones de descuentos directamente en tu correo semanal.
            </p>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); alert("¡Muchas gracias por suscribirte! Revisa tu casilla para el cupón BIENVENIDO10."); }} 
            className="w-full max-w-sm flex flex-col sm:flex-row gap-2 z-10"
          >
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Ingresa tu correo electrónico..."
              className="bg-white text-neutral-800 text-xs px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none w-full"
            />
            <button
              id="newsletter-btn"
              type="submit"
              className="bg-brand-beige text-brand-primary font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer shrink-0"
            >
              Unirme gratis
            </button>
          </form>
        </div>

      </div>

      {/* Active Article Full View Overlay drawer */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/70 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-4xl p-6 sm:p-8 md:p-10 shadow-2xl relative text-left overflow-hidden"
            >
              {/* Close Button element */}
              <button
                onClick={() => setActiveArticleId(null)}
                className="absolute top-6 right-6 bg-brand-cream/80 hover:bg-neutral-200 p-2 rounded-full text-neutral-700 hover:scale-110 active:scale-95 transition-all shadow"
                title="Volver al listado"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                
                {/* Navigation Breadcrumb */}
                <button
                  onClick={() => setActiveArticleId(null)}
                  className="flex items-center gap-1.5 text-xs text-brand-primary font-semibold hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" /> Volver al blog completo
                </button>

                {/* Category & Title */}
                <div className="space-y-2">
                  <span className="bg-brand-primary/10 text-brand-primary font-bold text-xs px-3.5 py-1.5 rounded-full inline-block">
                    {activeArticle.category}
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-800 leading-tight">
                    {activeArticle.title}
                  </h2>
                </div>

                {/* Author context bar */}
                <div className="flex flex-wrap gap-4 items-center text-xs text-neutral-400 border-y border-neutral-100 py-3 font-medium">
                  <span className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-lg text-neutral-600">
                    <User className="h-3.5 w-3.5 text-brand-secondary" />
                    Por: {activeArticle.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Fecha: {activeArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Lectura: {activeArticle.readTime}
                  </span>
                </div>

                {/* Article Cover Photo */}
                <div className="h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Full Article Content */}
                <div className="font-sans text-neutral-750 text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-wrap py-4 bg-brand-cream/20 p-5 rounded-2xl border border-brand-cream/60">
                  <p className="font-medium text-lg text-neutral-800 mb-4 font-serif italic border-l-4 border-brand-primary pl-4">
                    {activeArticle.summary}
                  </p>
                  {activeArticle.content}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setActiveArticleId(null)}
                    className="px-6 py-3 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-secondary cursor-pointer"
                  >
                    Entendido, Volver
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
