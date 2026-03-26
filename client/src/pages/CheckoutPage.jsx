import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, MapPin, CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clearCartLocal } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '123 Tech Avenue, Silicon Valley, CA 94025',
    paymentMethod: 'CREDIT_CARD',
  });

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await api.post('/orders/checkout', formData);
      dispatch(clearCartLocal());
      setStep(3);
    } catch (error) {
      alert(error.response?.data?.error || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-12 relative max-w-md mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                step >= i ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' : 'bg-white text-slate-400 border border-slate-200'
              }`}>
                {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold mt-2 ${step >= i ? 'text-primary-600' : 'text-slate-400'}`}>
                {i === 1 ? 'Shipping' : i === 2 ? 'Payment' : 'Success'}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-200 -z-0">
            <div 
              className="h-full bg-primary-600 transition-all duration-700" 
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary-600" />
                Shipping Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Saved Address</label>
                  <textarea 
                    className="input-field h-32 pt-4"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  />
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary-600" />
                Payment Details
              </h2>
              
              <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                <div className="flex justify-between mb-2 text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total Charged</span>
                  <span className="text-xl font-black text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 border-2 border-primary-100 bg-primary-50 rounded-xl">
                  <div className="w-5 h-5 rounded-full border-4 border-primary-600"></div>
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-slate-700">Credit / Debit Card</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded text-primary-600 border border-primary-100 font-bold">Encrypted</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="w-1/3 btn-secondary py-4 rounded-xl"
                >
                  Back
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-grow btn-primary py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-primary-200"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Pay'}
                </button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                <ShieldCheck className="w-4 h-4" />
                PCI-DSS Compliant Encryption
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Order Confirmed!</h2>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                Thank you for your purchase. We&apos;re processing your order and will notify you once it&apos;s on its way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/orders')}
                  className="btn-primary px-8"
                >
                  Track Order
                </button>
                <button 
                  onClick={() => navigate('/shop')}
                  className="btn-secondary px-8"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
