import { Globe, Twitter, Instagram, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div className="max-w-xs">
          <div className="flex items-center space-x-2 text-white mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight">ShopsMart</span>
          </div>
          <p className="text-sm leading-relaxed">
            Revolutionizing your e-commerce experience with premium designs and seamless interactions. Built for the modern shopper.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-grow justify-items-center">
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop" className="hover:text-primary-400 transition-colors">All Products</a></li>
              <li><a href="/shop?category=Clothes" className="hover:text-primary-400 transition-colors">Clothes</a></li>
              <li><a href="/shop?category=Shoes" className="hover:text-primary-400 transition-colors">Shoes</a></li>
              <li><a href="/shop?category=Accessories" className="hover:text-primary-400 transition-colors">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/orders" className="hover:text-primary-400 transition-colors">Order Status</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <h4 className="text-white font-semibold mb-4">Join our community</h4>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 transition-all active:scale-90"><Globe className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 transition-all active:scale-90"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 transition-all active:scale-90"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-primary-600 transition-all active:scale-90"><Github className="w-4 h-4" /></a>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-xs">
            <Mail className="w-3 h-3" />
            <span>support@shopsmart.dev</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-xs">
        &copy; {new Date().getFullYear()} ShopsMart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
