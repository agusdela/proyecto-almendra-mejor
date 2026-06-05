/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Heart } from "lucide-react";
import { motion } from "motion/react";

export default function ContactoSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Comer sano",
    message: ""
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API posting
    setFormSubmitted(true);
    setTimeout(() => {
      // Clear data
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Comer sano",
        message: ""
      });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contacto-section" className="py-16 bg-brand-cream/30 text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title block */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-brand-secondary font-bold">
            📞 Canales de Atención Directos
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-neutral-800">
            Ponete en Contacto
          </h2>
          <p className="text-sm text-neutral-500 font-light">
            ¿Tenés alguna inquietud sobre propiedades libres de gluten o querés consultar compras mayoristas? Responderemos en menos de 2 horas.
          </p>
        </div>

        {/* Master Column Grid config */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Block info column: WhatsApp, Hours, Channels (span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-brand-cream rounded-3xl p-6 sm:p-8 border border-brand-primary/10 space-y-6 text-left">
              <h3 className="font-display font-bold text-xl text-neutral-800">
                Información del Almacén
              </h3>
              
              <div className="space-y-5">
                
                {/* Channel 1: CABA Boutique */}
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-800">Local Boutique:</h4>
                    <p className="text-xs text-neutral-600 leading-snug mt-1">Av. 9 de Julio, Cura Brochero, Córdoba, Argentina.</p>
                  </div>
                </div>

                {/* Channel 2: WhatsApp info */}
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-800">WhatsApp de Guardia (Ventas):</h4>
                    <p 
                      onClick={() => window.open("https://wa.me/5493544635404?text=Hola!%20Contacto%20desde%20la%20tienda%20online.%20Me%20interesa%20hacer%20un%20pedido%20saludable.", "_blank")}
                      className="text-xs text-brand-primary font-bold mt-0.5 pointer-events-auto cursor-pointer hover:underline"
                    >
                      +54 9 3544 63-5404 (Click para chatear)
                    </p>
                    <p className="text-[10px] text-neutral-400">Atención instantánea de pedidos.</p>
                  </div>
                </div>

                {/* Channel 3: Email */}
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-800">Correo Institucional:</h4>
                    <p className="text-xs text-neutral-600 leading-snug mt-0.5">contacto@almacennaturalpremium.com.ar</p>
                  </div>
                </div>

                {/* Channel 4: Hours */}
                <div className="flex gap-4 items-start">
                  <div className="h-10 w-10 shrink-0 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-800">Horarios de Atención:</h4>
                    <p className="text-xs text-neutral-600 mt-1 font-medium">Lunes a Sábados de 09:00 a 20:00hs.</p>
                    <p className="text-[10px] text-neutral-400">Domingos y feriados cerrado por descanso agrario.</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Simulated Interactive Map Mockup element styled with Tailwind and high contrast and locator pins */}
            <div 
              onClick={() => window.open("https://www.google.com/maps?q=-31.706861,-65.020361", "_blank")}
              className="relative h-60 w-full rounded-3xl overflow-hidden shadow-md border border-neutral-100 bg-brand-cream cursor-pointer group"
              title="Abrir en mapas"
            >
              <div className="absolute inset-0 bg-[#e5e9f0]/60 z-0" />
              {/* Retro stylized map grids lines */}
              <div className="absolute inset-0 border-y border-neutral-200/40 border-dashed grid grid-cols-4 grid-rows-4 divide-x divide-neutral-200/40 pointer-events-none" />
              
              {/* Visual custom styled pins */}
              <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <span className="h-3 w-3 bg-brand-primary rounded-full absolute -top-0.5 animate-ping opacity-75" />
                <MapPin className="h-8 w-8 text-brand-primary drop-shadow" />
                <span className="bg-brand-primary text-brand-beige font-display text-[9px] font-bold py-1 px-2.5 rounded-full mt-1 whitespace-nowrap shadow-md">
                  Almendra Almacén Natural (Cura Brochero)
                </span>
              </div>

              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-neutral-100 text-[10px] z-10">
                <p className="font-bold text-neutral-800 uppercase tracking-wider">Av. 9 de Julio, Cura Brochero, Cba</p>
                <p className="text-neutral-400 mt-0.5 font-sans">Coordenadas: 31°42'24.7"S 65°01'13.3"W</p>
              </div>
            </div>

          </div>

          {/* Right Block: Dynamic validated Form (span 7) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-primary/10 shadow-sm text-left">
            <h3 className="font-display font-bold text-xl text-neutral-800 mb-6">
              Enviar correspondencia digital
            </h3>

            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl border border-emerald-200 text-center space-y-4 py-12"
              >
                <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto animate-bounce" />
                <div className="space-y-1.5">
                  <h4 className="font-display font-bold text-lg">¡Mensaje enviado con éxito!</h4>
                  <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
                    Tu correo ha sido procesado por nuestra mesa de soporte. Nos contactaremos de inmediato. ¡Muchas gracias!
                  </p>
                </div>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="bg-brand-primary text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-neutral-700">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label htmlFor="form-name" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                      Nombre completo *
                    </label>
                    <input
                      id="form-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ej. Sofía Rossi"
                      className="w-full text-xs font-mono p-3 bg-brand-cream border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-secondary/40 focus:ring-2 focus:ring-brand-secondary/10"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1">
                    <label htmlFor="form-email" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                      Correo Electrónico *
                    </label>
                    <input
                      id="form-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sofia@gmail.com"
                      className="w-full text-xs font-mono p-3 bg-brand-cream border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-secondary/40 focus:ring-2 focus:ring-brand-secondary/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone field */}
                  <div className="space-y-1">
                    <label htmlFor="form-phone" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                      Teléfono móvil *
                    </label>
                    <input
                      id="form-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ej. +54 9 3544 63-5404"
                      className="w-full text-xs font-mono p-3 bg-brand-cream border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-secondary/40"
                    />
                  </div>

                  {/* Subject selector */}
                  <div className="space-y-1">
                    <label htmlFor="form-subject" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                      Asunto de consulta *
                    </label>
                    <select
                      id="form-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full text-xs p-3 bg-brand-cream border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-secondary/40"
                    >
                      <option value="Comer sano">Asesoría de alimentación saludable</option>
                      <option value="Envíos nacionales">Dudas de envíos al Interior</option>
                      <option value="TACC / Celíacos">Inquietudes sobre Alérgenos o sin TACC</option>
                      <option value="Vendedor Mayorista">Alianzas comerciales / Línea Mayorista</option>
                      <option value="Otros">Otros motivos</option>
                    </select>
                  </div>
                </div>

                {/* Message text area */}
                <div className="space-y-1">
                  <label htmlFor="form-message" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                    Mensaje detallado *
                  </label>
                  <textarea
                    id="form-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe aquí tu consulta con el mayor de los detalles posibles..."
                    className="w-full text-xs font-mono p-3 bg-brand-cream border border-transparent rounded-xl outline-none focus:bg-white focus:border-brand-secondary/40 focus:ring-2 focus:ring-brand-secondary/10"
                  />
                </div>

                {/* Submit action butons */}
                <button
                  id="submit-contact-form"
                  type="submit"
                  className="w-full bg-brand-primary text-white font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-brand-secondary transition-all-custom shadow-md shadow-brand-primary/10 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Enviar Correspondencia Directa
                </button>

                <p className="text-[10px] text-neutral-450 font-light leading-snug pt-3 text-center">
                  Al enviar, aceptas que procesemos tus datos estrictamente para el despacho de esta consulta, en conformidad con las políticas legales argentinas. Prometemos nunca enviarte spam o publicidad intrusiva.
                </p>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
