import { Search, Filter, X } from 'lucide-react';

const ProductFilters = ({ filters, setFilters, categories }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-8 sticky top-24">
      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-600" />
          Categories
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => setFilters({ ...filters, category: '' })}
            className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all ${
              !filters.category ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters({ ...filters, category: cat.name })}
              className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all ${
                filters.category === cat.name ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min"
              className="w-1/2 input-field text-sm px-2 text-center"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <span className="text-slate-300">-</span>
            <input 
              type="number" 
              placeholder="Max"
              className="w-1/2 input-field text-sm px-2 text-center"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {(filters.category || filters.minPrice || filters.maxPrice || filters.search) && (
        <button 
          onClick={() => setFilters({ category: '', minPrice: '', maxPrice: '', search: '' })}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors py-2 border border-red-50 border-dashed rounded-lg"
        >
          <X className="w-3 h-3" />
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default ProductFilters;
