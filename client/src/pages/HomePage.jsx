import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Zap, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero background"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary-400 bg-primary-400/10 border border-primary-400/20 rounded-full uppercase">
              New Season Arrival
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Curating Excellence <br />
              <span className="text-primary-500">For Your Lifestyle</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-lg">
              Explore our curated collection of premium products, from tech essentials to timeless fashion. Quality meets aesthetics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-base">
                Shop Collection <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/shop" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-medium transition-all backdrop-blur-sm border border-white/10 flex items-center justify-center">
                Explore Categories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Fast Delivery</h3>
              <p className="text-slate-500 text-sm max-w-xs">Global shipping starting from just 48 hours for premium members.</p>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Secure Payments</h3>
              <p className="text-slate-500 text-sm max-w-xs">End-to-end encrypted transactions supporting over 50 payment methods.</p>
            </div>
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Curated Quality</h3>
              <p className="text-slate-500 text-sm max-w-xs">Evident quality assurance on every product listed on our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero CTA */}
      <section className="py-24 bg-slate-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Start Your Journey Today</h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-10 text-lg">
            Join thousands of satisfied customers who have upgraded their lifestyle with ShopsMart.
          </p>
          <Link to="/signup" className="btn-primary px-12 py-4 rounded-full text-lg shadow-2xl">
            Create Free Account
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-100 rounded-full opacity-20 blur-[100px] -z-0"></div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
