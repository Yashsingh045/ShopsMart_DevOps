import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';

const ShopPage = () => {
  const dispatch = useDispatch();
  const { items: products, pagination, loading } = useSelector(state => state.product);
  
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1
  });

  const categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Home' },
    { id: 4, name: 'Beauty' }
  ];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchProducts(filters));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, filters]); 
  // Wait, I used 'filtros' instead of 'filters' in thought, must fix.

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button className="md:hidden flex items-center gap-2 mb-4 text-slate-600 font-semibold border p-3 rounded-xl justify-center">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
          
          {/* Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <ProductFilters 
              filters={filters} 
              setFilters={setFilters} 
              categories={categories} 
            />
          </aside>

          {/* Product Center */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-slate-900 self-start">
                {filters.category ? `${filters.category} Collection` : 'All Products'}
                <span className="block text-sm font-normal text-slate-500 mt-1">
                  Showing {products.length} of {pagination.total || 0} results
                </span>
              </h1>
              
              <div className="relative w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="input-field pl-10 h-11 pr-4 text-sm"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                />
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                <p className="text-slate-500 font-medium">Curating your collection...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* No Results */}
                {products.length === 0 && (
                  <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-lg">No products found for the selected filters.</p>
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-16 space-x-2">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${
                          filters.page === i + 1 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-110' 
                            : 'bg-white text-slate-600 hover:bg-primary-50 border border-slate-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;
