import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[4/5] overflow-hidden bg-slate-100">
          <img 
            src={`https://picsum.photos/seed/${product.id}/600/800`} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-md">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded">
              {product.category?.name || 'Category'}
            </span>
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="ml-1 text-xs font-semibold text-slate-700">{product.averageRating || 0}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          
          <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-slate-900">
              ${product.price ? product.price.toFixed(2) : '0.00'}
            </span>
            <button 
              onClick={handleAddToCart}
              className="p-2 bg-slate-900 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-lg active:scale-90"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
