/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { deliveryRates } from "../data/mockData";
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  Percent, 
  Truck, 
  Tag, 
  User, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  ShieldCheck, 
  ArrowLeft, 
  ChevronRight, 
  Info,
  Loader
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CheckoutForm() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    currency,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    checkoutDetails,
    setCheckoutDetails,
    submitOrder,
    orderSuccessResult,
    setOrderSuccessResult,
    setCurrentView
  } = useStore();

  const [activeStep, setActiveStep] = useState<number>(0); // 0: Cart, 1: Personal, 2: Address, 3: Shipping, 4: Payment
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; msg?: string } | null>(null);
  
  // Validation States for checkout fields
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOrderingLoader, setIsOrderingLoader] = useState(false);

  // Totals calculations
  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.prices[item.selectedWeight] || 0;
    return acc + price * item.quantity;
  }, 0);

  // Free shipping condition: subtotal > 25000
  const isFreeShippingAvailable = subtotal >= 25000;

  // Selected Shipping fee (only valid if step >= 3 or default)
  const chosenRate = checkoutDetails.shippingMethod;
  const shippingFee = (isFreeShippingAvailable && chosenRate.id !== "retire") 
    ? 0 
    : chosenRate.price;

  // Discount calculation
  const discountAmount = appliedCoupon 
    ? (subtotal * appliedCoupon.discountPercentage) / 100 
    : 0;

  // Let's add 10% discount on Bank Transfer!
  const isTransferMethod = checkoutDetails.paymentMethod.type === "transfer";
  const transferDiscount = isTransferMethod 
    ? (subtotal * 10) / 100 
    : 0;

  const totalAmount = subtotal - discountAmount - transferDiscount + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCouponCode(couponInput);
    if (res.success) {
      setCouponFeedback({ success: true, msg: res.message });
      setCouponInput("");
    } else {
      setCouponFeedback({ success: false, msg: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    removeCouponCode();
    setCouponFeedback(null);
  };

  const formattedPrice = (arsPrice: number) => {
    if (currency === "USD") {
      return `u$s ${(arsPrice / 1000).toFixed(2)}`;
    }
    return `$${arsPrice.toLocaleString("es-AR")}`;
  };

  // Step Navigations & Validores
  const validateStep = (step: number): boolean => {
    const stepErrors: { [key: string]: string } = {};

    if (step === 1) { // Personal
      const p = checkoutDetails.personal;
      if (!p.name.trim()) stepErrors.name = "El nombre es obligatorio.";
      if (!p.email.includes("@")) stepErrors.email = "Ingresa un email válido.";
      if (!p.phone.trim()) stepErrors.phone = "El teléfono celular es requerido.";
      if (p.dni.length < 7) stepErrors.dni = "El DNI ingresado es incorrecto.";
    }

    if (step === 2) { // Address
      const a = checkoutDetails.address;
      if (!a.street.trim()) stepErrors.street = "La calle es olbligatoria.";
      if (!a.number.trim()) stepErrors.number = "El número catastral es requerido.";
      if (!a.city.trim()) stepErrors.city = "La localidad es requerida.";
      if (!a.zipCode.trim() || a.zipCode.length < 4) stepErrors.zipCode = "Ingresa un código postal válido.";
    }

    if (step === 4) { // Payment
      const m = checkoutDetails.paymentMethod;
      if (m.type === "credit") {
        if (!m.cardName?.trim()) stepErrors.cardName = "Nombre en la tarjeta es requerido.";
        if (!m.cardNumber?.trim() || m.cardNumber.length < 15) stepErrors.cardNumber = "Número de tarjeta incorrecto.";
        if (!m.cardExpiry?.includes("/")) stepErrors.cardExpiry = "Formato MM/AA requerido.";
        if (!m.cardCvc?.trim() || m.cardCvc.length < 3) stepErrors.cardCvc = "CVC requerido.";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Order Finalization execution
  const handlePlaceOrder = () => {
    if (!validateStep(4)) return;

    setIsOrderingLoader(true);
    setTimeout(() => {
      submitOrder();
      setIsOrderingLoader(false);
    }, 2000);
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutDetails(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCheckoutDetails(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleShippingChange = (method: any) => {
    setCheckoutDetails(prev => ({
      ...prev,
      shippingMethod: method
    }));
  };

  const handlePaymentTypeChange = (type: "credit" | "transfer") => {
    setCheckoutDetails(prev => ({
      ...prev,
      paymentMethod: { ...prev.paymentMethod, type }
    }));
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutDetails(prev => ({
      ...prev,
      paymentMethod: { ...prev.paymentMethod, [name]: value }
    }));
  };

  const stepsDescriptions = [
    { label: "Carrito", icon: ShoppingBag },
    { label: "Datos", icon: User },
    { label: "Dirección", icon: MapPin },
    { label: "Envío", icon: Truck },
    { label: "Pago", icon: CreditCard }
  ];

  // If order is completed successfully, show confirmation dashboard
  if (orderSuccessResult) {
    return (
      <div id="checkout-completion" className="py-12 bg-transparent max-w-3xl mx-auto px-4 text-left space-y-8 min-h-[70vh]">
        
        <div className="bg-[#E8F5E9] border border-brand-primary/20 rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <CheckCircle className="h-16 w-16 text-brand-primary mx-auto animate-bounce" />
          <div className="space-y-1.5">
            <h2 className="font-display font-bold text-2xl text-brand-primary">¡Compra Procesada con Éxito!</h2>
            <p className="text-sm text-brand-dark/80 font-light max-w-md mx-auto">
              Muchas gracias por tu confianza. Tu orden ha sido empaquetada. Estarás recibiendo una confirmación por WhatsApp en unos minutos.
            </p>
          </div>
          
          <div className="inline-block bg-white px-5 py-2.5 rounded-2xl border border-brand-primary/10 font-mono text-sm font-bold text-brand-primary">
            Código de Seguimiento: {orderSuccessResult.orderId}
          </div>
        </div>

        {/* Packing and coordinates summaries */}
        <div className="bg-white rounded-3xl p-6 border border-brand-primary/10 space-y-4">
          <h3 className="font-display font-semibold text-lg text-neutral-800 border-b border-neutral-200 pb-2">
            Resumen del Despacho
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-neutral-400 font-medium">Destinatario:</p>
              <p className="font-bold text-neutral-700">{orderSuccessResult.details.personal.name}</p>
              <p className="text-neutral-500">{orderSuccessResult.details.personal.email} | DNI {orderSuccessResult.details.personal.dni}</p>
            </div>

            <div className="space-y-1">
              <p className="text-neutral-400 font-medium">Lugar de Destino:</p>
              <p className="font-bold text-neutral-700">
                {orderSuccessResult.details.address.street} {orderSuccessResult.details.address.number} 
                {orderSuccessResult.details.address.apartment ? ` - Apt ${orderSuccessResult.details.address.apartment}` : ""}
              </p>
              <p className="text-neutral-500">
                {orderSuccessResult.details.address.city}, {orderSuccessResult.details.address.province} (CP {orderSuccessResult.details.address.zipCode})
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-neutral-400 font-medium">Envío seleccionado:</p>
              <p className="font-bold text-brand-primary">{orderSuccessResult.details.shippingMethod.name}</p>
              <p className="text-neutral-550 italic">Plazo estimado: {orderSuccessResult.details.shippingMethod.eta}</p>
            </div>

            <div className="space-y-1">
              <p className="text-neutral-400 font-medium">Método de Cobro:</p>
              <p className="font-bold uppercase text-brand-secondary">
                {orderSuccessResult.details.paymentMethod.type === "credit" ? "Tarjeta de Crédito Bancaria" : "Transferencia Bancaria Directa"}
              </p>
              {orderSuccessResult.details.paymentMethod.type === "transfer" && (
                <p className="text-amber-700 bg-amber-50 rounded px-2 py-1 w-fit text-[10px] font-semibold mt-1">✓ Pendiente de comprobante transferencia</p>
              )}
            </div>
          </div>
          
          <div className="h-px bg-neutral-200 w-full pt-2" />

          <div className="flex justify-between items-center text-sm font-bold pt-1">
            <span className="text-neutral-700">Total liquidado:</span>
            <span className="text-lg text-brand-primary">{formattedPrice(orderSuccessResult.total)}</span>
          </div>

        </div>

        {/* Bank transfer instruction box */}
        {orderSuccessResult.details.paymentMethod.type === "transfer" && (
          <div className="bg-amber-500/5 text-amber-900 border border-amber-500/20 p-5 rounded-3xl space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-800">
              <Info className="h-4.5 w-4.5" /> Coordinación para la Transferencia Bancaria
            </h4>
            <p className="text-xs font-light leading-relaxed">
              Para validar tu compra con el 10% de descuento asignado, por favor envía una transferencia bancaria a los siguientes datos, y envía el comprobante vía WhatsApp haciendo clic en el banner superior de la web:
            </p>
            <div className="bg-white p-3.5 rounded-xl border border-amber-100 font-mono text-xs text-neutral-700 space-y-1">
              <p><strong>Banco:</strong> Galicia S.A.</p>
              <p><strong>CBU:</strong> 0070142230004218945201</p>
              <p><strong>Alias:</strong> Almacen.Natural.Pr</p>
              <p><strong>Titular:</strong> Almacén de Granos S.R.L.</p>
              <p><strong>Monto exacto a transferir:</strong> <span className="text-brand-primary font-bold">{formattedPrice(orderSuccessResult.total)}</span></p>
            </div>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            onClick={() => { setOrderSuccessResult(null); setCurrentView("home"); }}
            className="px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Volver a la Página Principal
          </button>
        </div>

      </div>
    );
  }

  // If cart is empty, show empty state message
  if (cart.length === 0) {
    return (
      <div id="empty-cart-view" className="py-20 text-center max-w-md mx-auto px-4 space-y-6">
        <div className="h-20 w-20 rounded-full bg-brand-cream flex items-center justify-center text-brand-primary mx-auto">
          <ShoppingBag className="h-9 w-9 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-semibold text-xl text-neutral-800">Tu carrito está vacío</h2>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Explorá nuestro almacén donde encontrarás frutos secos, harinas sin gluten, cereales y especias seleccionadas de la más alta calidad argentina.
          </p>
        </div>
        <button
          onClick={() => { setCurrentView("shop"); }}
          className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
        >
          Ir a la Tienda Orgánica
        </button>
      </div>
    );
  }

  return (
    <section id="checkout-view" className="py-12 bg-transparent text-left font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic buying path progress steps */}
        <div className="relative mb-12 max-w-xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-100 -translate-y-1/2 -z-10" />
          
          <div className="flex justify-between items-center text-[10px] sm:text-xs">
            {stepsDescriptions.map((desc, idx) => {
              const StepIcon = desc.icon;
              const isPast = activeStep > idx;
              const isCurr = activeStep === idx;
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div 
                    title={desc.label}
                    className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${isPast ? "bg-brand-primary text-white" : isCurr ? "bg-brand-secondary text-white ring-4 ring-brand-secondary/10 font-bold" : "bg-neutral-100 text-neutral-400"}`}
                  >
                    {isPast ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-4.5 w-4.5" />}
                  </div>
                  <span className={`hidden sm:block text-[9px] uppercase tracking-wider font-semibold ${isPast || isCurr ? "text-brand-primary" : "text-neutral-400"}`}>
                    {desc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column layout: Left (Active Form), Right (Real-time summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Dynamic Step Forms (span 7 or 8) */}
          <div className="lg:col-span-7 bg-[#FAF8F5]/40 rounded-3xl p-6 sm:p-8 border border-neutral-100 text-xs">
            
            <AnimatePresence mode="wait">
              {/* STEP 0: Cart list overview */}
              {activeStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <h3 className="font-display font-bold text-lg text-neutral-800">Mi carrito de compras</h3>
                  
                  <div className="divide-y divide-brand-cream">
                    {cart.map((item) => {
                      const itemPrice = item.product.prices[item.selectedWeight] || 0;
                      return (
                        <div key={`${item.product.id}-${item.selectedWeight}`} className="flex gap-4 py-4 items-center">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="h-14 w-14 rounded-xl object-cover bg-neutral-100"
                            referrerPolicy="no-referrer"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-neutral-800 text-[13px] truncate leading-tight">{item.product.name}</h4>
                            <p className="text-[10px] text-neutral-400 mt-1 uppercase font-medium">{item.product.brand} • Peso: {item.selectedWeight}</p>
                            <span className="text-brand-primary font-bold text-[11px] font-mono mt-1 block">{formattedPrice(itemPrice)}</span>
                          </div>

                          {/* Quantities counter */}
                          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}
                              className="px-2 py-1.5 text-neutral-500 hover:bg-neutral-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 font-mono font-bold text-neutral-800">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                              className="px-2 py-1.5 text-neutral-500 hover:bg-neutral-50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Delete Item from cart */}
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                            className="p-1.5 text-neutral-350 hover:text-red-500 rounded-lg transition-colors"
                            title="Remover de mi compra"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Free shipping progress dynamic banner */}
                  <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isFreeShippingAvailable ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-neutral-50 text-neutral-600 border-neutral-200"}`}>
                    <Truck className={`h-5 w-5 ${isFreeShippingAvailable ? "text-emerald-600" : "text-neutral-400"}`} />
                    <div className="text-left font-sans text-[11px] leading-snug">
                      {isFreeShippingAvailable ? (
                        <p><strong>¡Felicitaciones!</strong> Tenés envío express gratuito bonificado por superar compras de $25.000.</p>
                      ) : (
                        <p>Te faltan <strong>{formattedPrice(25000 - subtotal)}</strong> para saltear costos de envío.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-semibold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow"
                    >
                      Siguiente: Datos de Facturación <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Datos de Facturación / Personales */}
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <h3 className="font-display font-bold text-lg text-neutral-800">1. Datos Personales</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Name field */}
                    <div className="space-y-1">
                      <label htmlFor="checkout-name" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Nombre y Apellido *
                      </label>
                      <input
                        id="checkout-name"
                        name="name"
                        type="text"
                        required
                        value={checkoutDetails.personal.name}
                        onChange={handlePersonalChange}
                        placeholder="Ej. Sofía Rossi"
                        className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-brand-secondary/40 focus:ring-2 focus:ring-brand-secondary/10"
                      />
                      {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name}</p>}
                    </div>

                    {/* Email field */}
                    <div className="space-y-1">
                      <label htmlFor="checkout-email" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Correo de contacto *
                      </label>
                      <input
                        id="checkout-email"
                        name="email"
                        type="email"
                        required
                        value={checkoutDetails.personal.email}
                        onChange={handlePersonalChange}
                        placeholder="sofia@gmail.com"
                        className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-brand-secondary/40"
                      />
                      {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email}</p>}
                    </div>

                    {/* Phone field */}
                    <div className="space-y-1">
                      <label htmlFor="checkout-phone" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Celular / WhatsApp *
                      </label>
                      <input
                        id="checkout-phone"
                        name="phone"
                        type="tel"
                        required
                        value={checkoutDetails.personal.phone}
                        onChange={handlePersonalChange}
                        placeholder="3544 63-5404"
                        className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-brand-secondary/40"
                      />
                      {errors.phone && <p className="text-[10px] text-red-500 font-semibold">{errors.phone}</p>}
                    </div>

                    {/* DNI field */}
                    <div className="space-y-1">
                      <label htmlFor="checkout-dni" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Número de DNI (identitario) *
                      </label>
                      <input
                        id="checkout-dni"
                        name="dni"
                        type="text"
                        required
                        value={checkoutDetails.personal.dni}
                        onChange={handlePersonalChange}
                        placeholder="Ej. 38558452"
                        className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-brand-secondary/40"
                      />
                      {errors.dni && <p className="text-[10px] text-red-500 font-semibold">{errors.dni}</p>}
                    </div>

                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-brand-cream">
                    <button
                      onClick={() => setActiveStep(0)}
                      className="text-neutral-500 flex items-center gap-1 hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" /> Volver al Carrito
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow"
                    >
                      Siguiente: Dirección <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Dirección coordinates */}
              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <h3 className="font-display font-bold text-lg text-neutral-800">2. Dirección de Entrega</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Street */}
                    <div className="space-y-1 sm:col-span-2">
                      <label htmlFor="checkout-street" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Calle *
                      </label>
                      <input
                        id="checkout-street"
                        name="street"
                        type="text"
                        required
                        value={checkoutDetails.address.street}
                        onChange={handleAddressChange}
                        placeholder="Ej. Av. Córdoba"
                        className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-brand-secondary/40"
                      />
                      {errors.street && <p className="text-[10px] text-red-500 font-semibold">{errors.street}</p>}
                    </div>

                    {/* Number */}
                    <div className="space-y-1">
                      <label htmlFor="checkout-number" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Número *
                      </label>
                      <input
                        id="checkout-number"
                        name="number"
                        type="text"
                        required
                        value={checkoutDetails.address.number}
                        onChange={handleAddressChange}
                        placeholder="Ej. 1420"
                        className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-brand-secondary/40"
                      />
                      {errors.number && <p className="text-[10px] text-red-500 font-semibold">{errors.number}</p>}
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Apartment */}
                    <div className="space-y-1">
                      <label htmlFor="checkout-apartment" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Piso / Departamento (Opcional)
                      </label>
                      <input
                        id="checkout-apartment"
                        name="apartment"
                        type="text"
                        value={checkoutDetails.address.apartment || ""}
                        onChange={handleAddressChange}
                        placeholder="Ej. 4 B"
                        className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none"
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label htmlFor="checkout-city" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Localidad *
                      </label>
                      <input
                        id="checkout-city"
                        name="city"
                        type="text"
                        required
                        value={checkoutDetails.address.city}
                        onChange={handleAddressChange}
                        placeholder="Mina Clavero o Córdoba"
                        className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none"
                      />
                      {errors.city && <p className="text-[10px] text-red-500 font-semibold">{errors.city}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Province list */}
                    <div className="space-y-1">
                      <label htmlFor="checkout-province" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Provincia *
                      </label>
                      <select
                        id="checkout-province"
                        name="province"
                        value={checkoutDetails.address.province}
                        onChange={handleAddressChange}
                        className="w-full p-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-brand-secondary/40"
                      >
                        <option value="CABA">Capital Federal (CABA)</option>
                        <option value="Buenos Aires">Provincia de Buenos Aires (GBA)</option>
                        <option value="Córdoba">Córdoba</option>
                        <option value="Santa Fe">Santa Fe</option>
                        <option value="Mendoza">Mendoza</option>
                        <option value="Patagonia">Patagonia (Neuquén/Chubut/Calamuchita)</option>
                        <option value="Norte">Norte (Salta / Jujuy / Tucumán)</option>
                      </select>
                    </div>

                    {/* Zip code */}
                    <div className="space-y-1">
                      <label htmlFor="checkout-zip" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">
                        Código Postal *
                      </label>
                      <input
                        id="checkout-zip"
                        name="zipCode"
                        type="text"
                        required
                        value={checkoutDetails.address.zipCode}
                        onChange={handleAddressChange}
                        placeholder="Ej. C1425"
                        className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none"
                      />
                      {errors.zipCode && <p className="text-[10px] text-red-500 font-semibold">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-brand-cream">
                    <button
                      onClick={handlePrevStep}
                      className="text-neutral-500 flex items-center gap-1 hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" /> Anterior Step
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow"
                    >
                      Siguiente: Envío <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Envío / Courier methods */}
              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <h3 className="font-display font-bold text-lg text-neutral-800">3. Método de Distribución</h3>
                  
                  <div className="space-y-3">
                    {deliveryRates.map((method) => {
                      const isSelected = checkoutDetails.shippingMethod.id === method.id;
                      const finalPrice = (isFreeShippingAvailable && method.id !== "retire") ? 0 : method.price;
                      return (
                        <div
                          key={method.id}
                          onClick={() => handleShippingChange(method)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between text-left ${isSelected ? "bg-brand-primary/5 border-brand-primary shadow-sm" : "bg-white hover:bg-[#FAF8F5]/80 border-neutral-100"}`}
                        >
                          <div className="flex items-center gap-3.5">
                            <input
                              type="radio"
                              name="shipMethod"
                              checked={isSelected}
                              onChange={() => handleShippingChange(method)}
                              className="accent-brand-primary h-4 w-4 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-neutral-800 text-[13px] leading-tight flex items-center gap-1.5">
                                {method.name}
                                {isFreeShippingAvailable && method.id !== "retire" && (
                                  <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full inline-block">¡Bonificado!</span>
                                )}
                              </p>
                              <p className="text-[10px] text-neutral-450 mt-1 italic">Plazo estimado: {method.eta}</p>
                            </div>
                          </div>

                          <span className="font-mono font-bold text-brand-primary text-xs shrink-0 pl-2">
                            {finalPrice === 0 ? "GRATIS" : formattedPrice(finalPrice)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-brand-cream">
                    <button
                      onClick={handlePrevStep}
                      className="text-neutral-500 flex items-center gap-1 hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" /> Anterior Segmento
                    </button>
                    <button
                      onClick={() => setActiveStep(4)}
                      className="px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow"
                    >
                      Siguiente: Método de Pago <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Métodos de pago (animated Credit Card vs bank detail labels) */}
              {activeStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <h3 className="font-display font-bold text-lg text-neutral-800">4. Método de Pago</h3>
                  
                  {/* Select Payment type */}
                  <div className="grid grid-cols-2 gap-4 pb-4">
                    <button
                      id="pay-by-credit"
                      onClick={() => handlePaymentTypeChange("credit")}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer font-semibold flex flex-col items-center gap-1.5 ${checkoutDetails.paymentMethod.type === "credit" ? "bg-brand-primary/5 border-brand-primary text-brand-primary shadow-sm" : "bg-white hover:bg-neutral-50 border-neutral-100 text-neutral-500"}`}
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Tarjeta de Crédito</span>
                    </button>
                    
                    <button
                      id="pay-by-transfer"
                      type="button"
                      onClick={() => handlePaymentTypeChange("transfer")}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer font-semibold flex flex-col items-center gap-1.5 ${checkoutDetails.paymentMethod.type === "transfer" ? "bg-brand-primary/5 border-brand-primary text-brand-primary shadow-sm" : "bg-white hover:bg-neutral-50 border-neutral-100 text-neutral-500"}`}
                    >
                      <Info className="h-5 w-5" />
                      <span className="flex items-center gap-1">
                        Transferencia Bancaria
                        <span className="bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">-10% OFF</span>
                      </span>
                    </button>
                  </div>

                  {/* Payment form contents */}
                  {checkoutDetails.paymentMethod.type === "credit" ? (
                    <div className="space-y-4">
                      {/* Virtual interactive credit Card Graphic */}
                      <div className="bg-gradient-to-tr from-brand-primary to-brand-secondary text-brand-beige p-6 rounded-2xl shadow-md min-h-[160px] flex flex-col justify-between text-left border border-brand-secondary/40 font-mono tracking-wide">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-brand-beige/85">Premium Organic Card</p>
                            <h4 className="font-bold text-xs">Almacén Natural</h4>
                          </div>
                          <span className="text-xl font-bold italic font-sans text-brand-beige border border-brand-beige px-2 py-0.5 rounded-lg">VISA</span>
                        </div>
                        
                        <div className="space-y-3 pt-4">
                          <p className="text-sm md:text-base tracking-[0.2em] font-bold text-white">
                            {checkoutDetails.paymentMethod.cardNumber || "•••• •••• •••• ••••"}
                          </p>
                          <div className="flex justify-between text-[11px] text-brand-beige/85">
                            <span className="truncate max-w-[150px] font-sans font-medium uppercase">
                              {checkoutDetails.paymentMethod.cardName || "MARÍA SOFÍA ROSSI"}
                            </span>
                            <span>{checkoutDetails.paymentMethod.cardExpiry || "MM/AA"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label htmlFor="card-name" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">Nombre grabado en el plástico *</label>
                          <input
                            id="card-name"
                            name="cardName"
                            type="text"
                            required
                            value={checkoutDetails.paymentMethod.cardName || ""}
                            onChange={handleCardDetailsChange}
                            placeholder="Ej. SOFÍA ROSSI"
                            className="w-full text-xs font-mono p-3 bg-white border border-neutral-201 border-neutral-200 rounded-xl outline-none"
                          />
                          {errors.cardName && <p className="text-[10px] text-red-500 font-semibold">{errors.cardName}</p>}
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="card-number" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">Número de tarjeta bancaria *</label>
                          <input
                            id="card-number"
                            name="cardNumber"
                            type="text"
                            maxLength={16}
                            required
                            value={checkoutDetails.paymentMethod.cardNumber || ""}
                            onChange={handleCardDetailsChange}
                            placeholder="4500120034005600"
                            className="w-full text-xs font-mono p-3 bg-white border border-neutral-221 border-neutral-200 rounded-xl outline-none animate-in"
                          />
                          {errors.cardNumber && <p className="text-[10px] text-red-500 font-semibold">{errors.cardNumber}</p>}
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="card-expiry" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block">Vencimiento *</label>
                          <input
                            id="card-expiry"
                            name="cardExpiry"
                            type="text"
                            maxLength={5}
                            required
                            value={checkoutDetails.paymentMethod.cardExpiry || ""}
                            onChange={handleCardDetailsChange}
                            placeholder="MM/AA"
                            className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none"
                          />
                          {errors.cardExpiry && <p className="text-[10px] text-red-500 font-semibold">{errors.cardExpiry}</p>}
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="card-cvc" className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block font-mono">Digito CVC (dorso) *</label>
                          <input
                            id="card-cvc"
                            name="cardCvc"
                            type="text"
                            maxLength={4}
                            required
                            value={checkoutDetails.paymentMethod.cardCvc || ""}
                            onChange={handleCardDetailsChange}
                            placeholder="Ej. 352"
                            className="w-full text-xs font-mono p-3 bg-white border border-neutral-200 rounded-xl outline-none"
                          />
                          {errors.cardCvc && <p className="text-[10px] text-red-500 font-semibold">{errors.cardCvc}</p>}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-brand-cream p-5 rounded-2xl border border-brand-cream text-left space-y-3 font-sans">
                      <div className="flex gap-2 text-brand-primary font-bold">
                        <CheckCircle className="h-5 w-5 shrink-0" />
                        <h4>10% de Descuento por Transferencia Directa</h4>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed font-light">
                        Al elegir transferencia bancaria, se calcula un **10% de ahorro adicional** sobre la compra. Los datos bancarios precisos (CBU, Alias) y un enlace para enviar tu comprobante te serán mostrados inmediatamente después de hacer click en "Finalizar Compra".
                      </p>
                      <p className="text-[10px] text-neutral-400 italic">Despacharemos una vez que confirmemos la transferencia en nuestro panel administrativo.</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-brand-cream">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="text-neutral-500 flex items-center gap-1 hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" /> Anterior Segmento
                    </button>
                    
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isOrderingLoader}
                      className="px-6 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow hover:scale-[1.01] active:scale-95 disabled:bg-neutral-350 cursor-pointer text-xs"
                    >
                      {isOrderingLoader ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Procesando Compra...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4.5 w-4.5" />
                          Finalizar Compra y Pagar
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* RIGHT: Real-time buying summary sidebar (span 5) */}
          <div className="lg:col-span-5 bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-neutral-150 space-y-6 text-left">
            <h3 className="font-display font-semibold text-lg text-neutral-850 border-b border-brand-cream pb-3">
              Resumen de Compra
            </h3>

            {/* List mini products preview with weights */}
            <div className="max-h-[160px] overflow-y-auto space-y-4 pr-1.5">
              {cart.map((item) => {
                const itemPrice = item.product.prices[item.selectedWeight] || 0;
                return (
                  <div key={`${item.product.id}-${item.selectedWeight}`} className="flex justify-between items-center text-xs">
                    <div className="truncate flex-1 pr-3">
                      <p className="font-semibold text-neutral-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{item.selectedWeight} • ({item.quantity} {item.quantity === 1 ? "bulto" : "bultos"})</p>
                    </div>
                    <span className="font-mono text-neutral-700 font-semibold">{formattedPrice(itemPrice * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            <div className="h-px bg-brand-cream/80 w-full" />

            {/* Price lines */}
            <div className="space-y-2.5 text-xs text-neutral-600 font-sans font-medium">
              <div className="flex justify-between">
                <span>Subtotal Almacén:</span>
                <span className="font-mono text-neutral-800">{formattedPrice(subtotal)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-brand-primary">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" /> Cupón "{appliedCoupon.code}" ({appliedCoupon.discountPercentage}%):
                  </span>
                  <span className="font-mono">- {formattedPrice(discountAmount)}</span>
                </div>
              )}

              {isTransferMethod && (
                <div className="flex justify-between text-brand-secondary bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-200/40">
                  <span>Descuento de Transferencia (10%):</span>
                  <span className="font-mono font-bold">- {formattedPrice(transferDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="flex items-center gap-1 text-[11px]">
                  <Truck className="h-4 w-4 text-brand-primary" /> Costo de Envió ({chosenRate.name.split(" ")[0]}):
                </span>
                <span className="font-mono text-neutral-800">
                  {shippingFee === 0 ? "GRATIS" : formattedPrice(shippingFee)}
                </span>
              </div>
            </div>

            <div className="h-px bg-brand-cream/80 w-full" />

            {/* Total price visual layout */}
            <div className="flex justify-between items-center pt-1 text-sm font-bold font-display">
              <span className="text-neutral-850">Total de orden:</span>
              <span className="text-xl text-brand-primary font-mono">{formattedPrice(totalAmount)}</span>
            </div>

            {/* Coupons Applying box Form */}
            {activeStep === 0 && (
              <div className="pt-2 border-t border-brand-cream mt-2 space-y-3">
                <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  ¿Tenés un cupón de descuento?
                </label>
                
                {appliedCoupon ? (
                  <div className="bg-brand-primary/5 p-3 rounded-xl border border-brand-primary flex items-center justify-between text-xs text-brand-primary">
                    <span className="font-semibold flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" /> "{appliedCoupon.code}" activo
                    </span>
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:scale-110 active:scale-90 font-bold text-xs"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                    <input
                      id="coupon-apply"
                      type="text"
                      placeholder="Ej. BIENVENIDO10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="p-2.5 text-[11px] font-mono rounded-xl border border-neutral-200 outline-none w-full bg-white text-neutral-800 focus:border-brand-primary uppercase"
                    />
                    <button
                      id="apply-coupon-btn"
                      type="submit"
                      className="px-4 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-secondary cursor-pointer shrink-0"
                    >
                      Aplicar
                    </button>
                  </form>
                )}

                {/* Coupons error/success messages */}
                {couponFeedback && (
                  <p className={`text-[10px] font-bold ${couponFeedback.success ? "text-brand-primary" : "text-red-500"}`}>
                    {couponFeedback.msg}
                  </p>
                )}

                {/* Helpful tips of active codes */}
                <div className="bg-white/60 p-3 rounded-xl border border-brand-cream/80 text-[10px] text-neutral-500 leading-snug font-sans">
                  <p className="font-semibold text-neutral-700">Cupones de prueba sugeridos:</p>
                  <ul className="list-disc pl-3.5 mt-1 space-y-0.5">
                    <li><strong>BIENVENIDO10</strong> (10% OFF, compra mínima $10.000)</li>
                    <li><strong>NATURAL15</strong> (15% OFF, compra mínima $25.000)</li>
                  </ul>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
