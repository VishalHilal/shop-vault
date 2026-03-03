import { useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts.js';
import ProductCard from '../components/products/ProductCard.jsx'
import ProductSkeleton from '../components/products/ProductSkeleton.jsx';
import { Search, SlidersHorizontal, Package, RefreshCw } from 'lucide-react';

export default function ProductsPage() {
  const {
    products, loading, error, search, setSearch,
    category, setCategory, categories, sortBy, setSortBy,
    total, hasMore, loadMore,
  } = useProducts();

  const loaderRef = useRef(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Products</h2>
          <p className="text-gray-400 font-bold text-base mt-2">
            {loading && products.length === 0 ? 'Loading...' : `${total} products found`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <SlidersHorizontal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-12 pr-8 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white appearance-none cursor-pointer min-w-[180px] focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white appearance-none cursor-pointer min-w-[180px] focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all duration-300"
          >
            <option value="">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="title-asc">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Active filters */}
      {(search || category || sortBy) && (
        <div className="flex flex-wrap gap-3">
          {search && (
            <span className="bg-orange-500/15 text-orange-400 border border-orange-500/30 text-sm px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-xl">
              Search: "{search}"
              <button onClick={() => setSearch('')} className="hover:text-white transition-colors">×</button>
            </span>
          )}
          {category && (
            <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-sm px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-xl">
              {category}
              <button onClick={() => setCategory('')} className="hover:text-white transition-colors">×</button>
            </span>
          )}
          {sortBy && (
            <span className="bg-purple-500/15 text-purple-400 border border-purple-500/30 text-sm px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-xl">
              Sorted
              <button onClick={() => setSortBy('')} className="hover:text-white transition-colors">×</button>
            </span>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-xl">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button onClick={() => loadMore()} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors duration-300 flex items-center gap-2 mx-auto">
            <RefreshCw size={18} /> Retry
          </button>
        </div>
      )}

      {/* Products grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <div key={`${product.id}-${i}`} style={{ animationDelay: `${(i % 12) * 50}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && !error && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-16 text-center shadow-xl">
          <div className="w-20 h-20 bg-gray-700/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-gray-500" />
          </div>
          <h3 className="font-bold text-xl mb-3 text-white">No products found</h3>
          <p className="text-gray-400 text-base mb-6">Try a different search or category</p>
          <button onClick={() => { setSearch(''); setCategory(''); setSortBy(''); }} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors duration-300 flex items-center gap-2 mx-auto">
            <RefreshCw size={18} /> Clear Filters
          </button>
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="h-4" />

      {/* End message */}
      {!hasMore && products.length > 0 && !loading && (
        <p className="text-center text-gray-500 text-base py-6 font-mono bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl inline-block mx-auto px-6">— All {total} products loaded —</p>
      )}
    </div>
  );
}
