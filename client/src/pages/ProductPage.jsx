import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, ArrowLeft, Loader2, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector(state => state.product);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProductById(id));
    // Fetch similar products logic (could be a thunk too, but keeping it simple for now)
    const fetchSimilar = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/products/${id}/similar`);
        const data = await res.json();
        setSimilarProducts(data);
      } catch (err) {
        console.error('Failed to fetch similar products');
      }
    };
    fetchSimilar();
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity }));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Oops! Product not found.</h2>
      <Link to="/shop" className="btn-primary flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>
    </div>
  );

  if (!product) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link to="/shop" className="inline-flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-inner">
              <img 
                src={`https://picsum.photos/seed/${product.id}/1200/1200`} 
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary-500 transition-all">
                  <img src={`https://picsum.photos/seed/${product.id + i}/300/300`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary-50 text-primary-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{product.category.name}</span>
                {product.stock > 0 ? (
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-widest">In Stock</span>
                ) : (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase tracking-widest">Out of Stock</span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.averageRating) ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                  <span className="ml-2 text-sm font-bold text-slate-700">{product.averageRating}</span>
                </div>
                <span className="text-slate-400 text-sm font-medium">{product._count?.reviews || 0} customer reviews</span>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                <span className="text-slate-400 line-through text-lg">${(product.price * 1.2).toFixed(2)}</span>
                <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">20% OFF</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-base">
                {product.description || "No description provided for this premium item. Experience the quality and craftsmanship that ShopsMart is known for."}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-slate-200 rounded-xl px-2 py-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-700">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-grow btn-primary flex items-center justify-center gap-3 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                  <Heart className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg"><Truck className="w-4 h-4" /></div>
                  Free global shipping
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg"><ShieldCheck className="w-4 h-4" /></div>
                  2-year warranty
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rating Breakdown Component would go here (already implemented in service) */}

        {/* Similar Products */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarProducts.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
