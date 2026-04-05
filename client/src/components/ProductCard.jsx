import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { folders } = useSelector(state => state.wishlist);
  const { user } = useSelector(state => state.auth);

  // Find the default "Favourites" folder
  const defaultFolder = folders.find(f => f.isDefault) || folders[0];
  const isWishlisted = defaultFolder?.items?.some(item => item.productId === product.id) || false;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to add items to cart');
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to add items to wishlist');
    if (!defaultFolder) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist({ folderId: defaultFolder.id, productId: product.id }));
    } else {
      dispatch(addToWishlist({ folderId: defaultFolder.id, productId: product.id }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[4/5] overflow-hidden bg-slate-100 relative">
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={product.images && product.images.length > 0 ? product.images[0].url : `https://picsum.photos/seed/${product.id}/600/800`} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
          <button 
            onClick={handleWishlistToggle}
            className={`absolute top-4 right-4 p-2 backdrop-blur-md rounded-full hover:scale-110 active:scale-90 transition-all shadow-lg z-10 ${
              isWishlisted ? 'bg-primary-600 text-white' : 'bg-white/90 text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-2.5 py-1 rounded-full">
              {product.category?.name || 'Category'}
            </span>
            <div className="flex items-center text-amber-400 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-current" />
              <span className="ml-1 text-[10px] font-bold text-amber-700">{product.averageRating || 0}</span>
            </div>
          </div>
          
          <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1.5 text-lg">
            {product.name}
          </h3>
          
          <p className="text-slate-500 text-xs line-clamp-2 mb-5 h-8 leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Price</span>
              <span className="text-xl font-black text-slate-900">
                ${product.price ? product.price.toFixed(2) : '0.00'}
              </span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="p-3 bg-slate-900 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-xl active:scale-90"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
