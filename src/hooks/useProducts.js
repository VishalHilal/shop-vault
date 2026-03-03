import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'https://dummyjson.com/products';
const PAGE_LIMIT = 12;

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('');

  // Fetch categories once
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((data) => setCategories(data.map((c) => (typeof c === 'string' ? c : c.name || c.slug))))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async (reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const currentSkip = reset ? 0 : skip;
      let url;

      if (search) {
        url = `${API_BASE}/search?q=${encodeURIComponent(search)}&limit=${PAGE_LIMIT}&skip=${currentSkip}`;
      } else if (category) {
        url = `${API_BASE}/category/${encodeURIComponent(category)}?limit=${PAGE_LIMIT}&skip=${currentSkip}`;
      } else {
        url = `${API_BASE}?limit=${PAGE_LIMIT}&skip=${currentSkip}`;
      }

      if (sortBy) {
        const [field, order] = sortBy.split('-');
        url += `&sortBy=${field}&order=${order}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();

      const newProducts = data.products || [];
      setTotal(data.total || 0);

      if (reset) {
        setProducts(newProducts);
        setSkip(PAGE_LIMIT);
        setHasMore(newProducts.length < (data.total || 0));
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
        setSkip((s) => s + PAGE_LIMIT);
        setHasMore(currentSkip + newProducts.length < (data.total || 0));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [skip, search, category, sortBy]);

  // Reset and refetch on filter/search/sort change
  useEffect(() => {
    setSkip(0);
    setProducts([]);
    setHasMore(true);
    fetchProducts(true);
  }, [search, category, sortBy]);

  const loadMore = () => {
    if (!loading && hasMore) fetchProducts(false);
  };

  return {
    products, loading, error, search, setSearch,
    category, setCategory, categories,
    sortBy, setSortBy, total, hasMore, loadMore,
  };
}
