"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Phone, CreditCard, Check, Globe } from "lucide-react";
import { FadeInUp, FadeIn } from "@/utility/MotionComponents";
import PaymentForm from "@/components/donate/PaymentForm";

const PRESET_AMOUNTS_KES = [500, 1000, 2500, 5000, 10000];
const PRESET_AMOUNTS_USD = [5, 10, 25, 50, 100];

const DonatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    isAnonymous: false,
  });
  const [amount, setAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [currency, setCurrency] = useState("KES");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [step, setStep] = useState(1);

  const presetAmounts = currency === "KES" ? PRESET_AMOUNTS_KES : PRESET_AMOUNTS_USD;

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setAmount(null);
    }
  };

  const getSelectedAmount = () => {
    return amount || (customAmount ? parseInt(customAmount, 10) : 0);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (getSelectedAmount() > 0) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const formatCurrency = (value) => {
    return currency === "KES" ? `KES ${value.toLocaleString()}` : `$${value}`;
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setAmount(null);
    setCustomAmount("");
    if (newCurrency === "USD") {
      setPaymentMethod("card");
    }
  };

  return (
    <section className="bg-sand py-16 md:py-24 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-700">
            Support Our Mission
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-700 mx-auto mb-6"></div>
          <p className="text-ink/70 max-w-2xl mx-auto">
            Help us preserve African languages for future generations. Your donation
            supports curriculum development, teacher training, and student scholarships.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {step === 1 ? (
            <div className="grid md:grid-cols-2 gap-8">
              <FadeInUp>
                <div className="card p-8">
                  <h2 className="text-xl font-semibold text-ink mb-6">
                    Choose Amount
                  </h2>

                  <div className="flex gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange("KES")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        currency === "KES"
                          ? "bg-primary text-white"
                          : "bg-sand text-ink/70 hover:bg-gray-200"
                      }`}
                    >
                      🇰🇪 KES
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange("USD")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        currency === "USD"
                          ? "bg-primary text-white"
                          : "bg-sand text-ink/70 hover:bg-gray-200"
                      }`}
                    >
                      🌍 USD
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAmountSelect(preset)}
                        className={`py-3 px-4 rounded-lg font-medium transition-all ${
                          amount === preset
                            ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                            : "bg-sand text-ink/75 hover:bg-gray-200"
                        }`}
                      >
                        {formatCurrency(preset)}
                      </button>
                    ))}
                  </div>

                  <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/60">
                      {currency === "KES" ? "KES" : "$"}
                    </span>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="Custom amount"
                      className={`w-full pl-14 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                        customAmount ? "border-primary" : "border-gray-300"
                      }`}
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-ink mb-4">
                    Payment Method
                  </h3>

                  <div className="space-y-3">
                    {currency === "KES" && (
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("mpesa")}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                          paymentMethod === "mpesa"
                            ? "border-primary bg-primary/5"
                            : "border-sand-200 hover:border-primary/40"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-ink">M-Pesa</p>
                          <p className="text-sm text-ink/60">Pay with mobile money</p>
                        </div>
                        {paymentMethod === "mpesa" && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-sand-200 hover:border-primary/40"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-ink">Card Payment</p>
                        <p className="text-sm text-ink/60">Visa, Mastercard, etc.</p>
                      </div>
                      {paymentMethod === "card" && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  </div>

                  {currency === "USD" && (
                    <p className="text-sm text-ink/60 mt-4 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      International payments accepted
                    </p>
                  )}
                </div>
              </FadeInUp>

              <FadeIn>
                <div className="card p-8">
                  <h2 className="text-xl font-semibold text-ink mb-6">
                    Your Information
                  </h2>
                  <form onSubmit={handleContinue} className="space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-ink/75"
                      >
                        Name {formData.isAnonymous && "(optional)"}
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block mb-2 text-sm font-medium text-ink/75"
                      >
                        Phone Number {paymentMethod === "mpesa" && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required={paymentMethod === "mpesa"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        placeholder="0712345678"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block mb-2 text-sm font-medium text-ink/75"
                      >
                        Message (optional)
                      </label>
                      <textarea
                        id="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                        placeholder="Leave a message with your donation"
                      ></textarea>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        id="isAnonymous"
                        checked={formData.isAnonymous}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-ink/70">
                        Make my donation anonymous
                      </span>
                    </label>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-ink/70">Donation Amount</span>
                        <span className="text-xl font-bold text-primary">
                          {getSelectedAmount() > 0
                            ? formatCurrency(getSelectedAmount())
                            : "Select amount"}
                        </span>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={getSelectedAmount() === 0}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-700 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Payment
                      </motion.button>
                    </div>
                  </form>
                </div>
              </FadeIn>
            </div>
          ) : (
            <FadeInUp>
              <div className="card p-8 max-w-xl mx-auto">
                <button
                  onClick={handleBack}
                  className="mb-6 text-ink/70 hover:text-primary transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-ink mb-2">
                    Complete Your Donation
                  </h2>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(getSelectedAmount())}
                  </p>
                </div>

                <PaymentForm
                  amount={getSelectedAmount()}
                  currency={currency}
                  paymentMethod={paymentMethod}
                  donorName={formData.name}
                  donorEmail={formData.email}
                  donorPhone={formData.phone}
                  message={formData.message}
                  isAnonymous={formData.isAnonymous}
                />
              </div>
            </FadeInUp>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-ink mb-4">
              Where Your Donation Goes
            </h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">40%</div>
                <p className="text-sm text-ink/70">Curriculum Development</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">35%</div>
                <p className="text-sm text-ink/70">Teacher Training</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">25%</div>
                <p className="text-sm text-ink/70">Student Scholarships</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DonatePage;
