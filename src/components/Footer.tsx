/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useStore } from "../context/StoreContext";
import { categories } from "../data/mockData";
import logoImg from "../assets/images/almendra_logo_clear_1780680079584.png";
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Heart,
  ExternalLink
} from "lucide-react";

export default function Footer() {
  const { setCurrentView, setFilterState } = useStore();

  const handleCategoryClick = (catId: string) => {
    setFilterState(f => ({ ...f, category: catId, searchQuery: "" }));
    setCurrentView("shop");
    setTimeout(() => {
      document.getElementById("section-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleNavClick = (view: any) => {
    if (view === "shop") {
      setFilterState(f => ({ ...f, category: "", searchQuery: "" }));
      setCurrentView("shop");
      setTimeout(() => {
        document.getElementById("section-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (view === "contact") {
      setCurrentView("contact");
      setTimeout(() => {
        document.getElementById("section-contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      setCurrentView("home");
      document.getElementById("section-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer id="app-footer" className="bg-[#333333] text-[#FAF9F2] pt-16 pb-8 border-t border-brand-primary/15 font-sans text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Upper Column divisions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-[#444444]">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick("home")}>
              <img 
                src={logoImg} 
                alt="Almendra Almacén Natural Logo" 
                className="h-10 w-10 rounded-full object-cover bg-white shadow-sm border border-neutral-600"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-xl tracking-tight leading-none">
                  ALMENDRA
                </span>
                <span className="font-display font-medium text-[9px] tracking-[0.15em] leading-none text-brand-secondary mt-0.5">
                  ALMACÉN NATURAL
                </span>
              </div>
            </div>
            
            <p className="text-xs text-brand-beige/70 leading-relaxed font-light font-sans pt-1">
              Tienda online premium de alimentos saludables, naturales y gourmet en Argentina. Convenios directos con productores regionales orgánicos para garantizar máxima frescura biológica.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-3">
              <a href="https://www.instagram.com/almendra_almacennatural_?igsh=MXY1MmhkanVubGwyMw%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="p-2.5 bg-[#444444] hover:bg-brand-primary rounded-xl text-white transition-all hover:-translate-y-1" title="Instagram">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="https://www.facebook.com/share/19dvQHxczJ/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="p-2.5 bg-[#444444] hover:bg-brand-primary rounded-xl text-white transition-all hover:-translate-y-1" title="Facebook">
                <Facebook className="h-4.5 w-4.5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2.5 bg-[#444444] hover:bg-brand-primary rounded-xl text-white transition-all hover:-translate-y-1" title="Youtube">
                <Youtube className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Helpers */}
          <div className="space-y-4 text-xs font-sans">
            <h3 className="text-sm font-semibold tracking-wider font-display text-white uppercase">
              La Empresa
            </h3>
            
            <ul className="space-y-2.5 font-light text-brand-beige/80">
              <li>
                <button onClick={() => handleNavClick("home")} className="hover:text-brand-secondary cursor-pointer transition-colors block">
                  Inicio / Volver Arriba
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("shop")} className="hover:text-brand-secondary cursor-pointer transition-colors block">
                  Catálogo de Productos
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("contact")} className="hover:text-brand-secondary cursor-pointer transition-colors block">
                  Soporte & Reclamos
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Category Filtering list */}
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-semibold tracking-wider font-display text-white uppercase">
              Categorías recomendadas
            </h3>
            
            <ul className="space-y-2.5 font-light text-brand-beige/80">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="hover:text-brand-secondary cursor-pointer transition-colors text-left"
                  >
                    🌿 {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Location/Contact */}
          <div className="space-y-4 text-xs font-sans text-left">
            <h3 className="text-sm font-semibold tracking-wider font-display text-white uppercase">
              Información de Sucursal
            </h3>
            
            <ul className="space-y-3 font-light text-brand-beige/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-brand-secondary shrink-0 mt-0.5" />
                <span>Av. 9 de Julio, Cura Brochero, Córdoba, Argentina.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-secondary shrink-0" />
                <span>+54 9 3544 63-5404 (Pedidos)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-secondary shrink-0" />
                <span>contacto@almacennatural.com.ar</span>
              </li>
            </ul>
            
            <div className="bg-[#444444] p-3.5 rounded-xl flex items-center gap-2 text-[10px] font-sans font-semibold border border-[#555555] text-brand-beige w-fit">
              <ShieldCheck className="h-4 w-4 text-brand-secondary" />
              <span>Conexión SSL Segura Protegida</span>
            </div>
          </div>

        </div>

        {/* Lower payment, legal and protective signals */}
        <div className="pt-8 flex flex-col md:flex-row gap-6 justify-between items-center text-xs font-light text-brand-beige/65">
          
          <div className="space-y-1.5 text-center md:text-left">
            <p className="font-semibold text-white">© 2026 Almendra Almacén Natural SRL. Todos los derechos reservados.</p>
            <p className="text-[10px]">Inspirado en Almendra Almacen Natural. Prohibida su copia comercial sin aval legal. Córdoba - Argentina.</p>
          </div>

          {/* Styled Pay methods logos */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#8E939E] mr-1.5">Pagos 100% Seguros:</span>
            <span className="bg-[#444444] text-white px-2 py-1 rounded font-mono text-[9px] font-bold tracking-widest leading-none">VISA</span>
            <span className="bg-[#444444] text-white px-2 py-1 rounded font-mono text-[9px] font-bold tracking-widest leading-none">MASTERCARD</span>
            <span className="bg-[#444444] text-white px-2 py-1 rounded font-mono text-[9px] font-bold tracking-widest leading-none">AMEX</span>
            <span className="bg-[#444444] text-white px-2 py-1 rounded font-mono text-[9px] font-bold tracking-widest leading-none">MPAGO</span>
            <span className="bg-[#444444] text-white px-2 py-1 rounded font-mono text-[9px] font-bold tracking-widest leading-none">BANCO GALICIA</span>
          </div>

        </div>

        {/* Legal links disclaimer as required by Argentine consumer protection laws */}
        <div className="mt-6 pt-4 border-t border-[#444444]/40 flex flex-wrap justify-center gap-6 text-[10px] text-brand-beige/50 font-sans">
          <a href="#terminos" className="hover:underline flex items-center gap-0.5">Defensa del Consumidor Argentina <ExternalLink className="h-2 w-2" /></a>
          <span>•</span>
          <a href="#terminos" className="hover:underline">Términos y condiciones de Uso</a>
          <span>•</span>
          <a href="#politica" className="hover:underline">Políticas de Privacidad Orgánicas</a>
          <span>•</span>
          <a href="#fiscal" className="hover:underline">Data Fiscal AFIP Formulario 960</a>
        </div>

      </div>
    </footer>
  );
}
