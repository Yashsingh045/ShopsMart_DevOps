import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ShopsMart</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
            <Link to="/shop" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Shop</Link>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500 transition-all w-40 lg:w-64"
              />
              <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            <Link to="/wishlist" className="text-slate-600 hover:text-primary-600 transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative text-slate-600 hover:text-primary-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {items.length}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/login"} className="flex items-center space-x-1 text-slate-600 hover:text-primary-600 transition-colors">
              <User className="w-5 h-5" />
              {user && <span className="hidden lg:block text-sm font-medium truncate max-w-[80px]">{user.name}</span>}
            </Link>
            <button className="md:hidden">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
