import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://backend-gilt-three-74.vercel.app';

// Cache so we don't re-fetch on every page navigation
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

export const useProducts = () => {
  const [products, setProducts] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState('');

  useEffect(() => {
    const now = Date.now();
    if (cache && now - cacheTime < CACHE_TTL) {
      setProducts(cache);
      setLoading(false);
      return;
    }
    setLoading(true);
    axios.get(`${API}/api/products`)
      .then(({ data }) => {
        cache = data;
        cacheTime = Date.now();
        setProducts(data);
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
};

export const useProduct = (handle) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!handle) return;
    // Try cache first
    if (cache) {
      const found = cache.find(p => p.handle === handle);
      if (found) { setProduct(found); setLoading(false); return; }
    }
    setLoading(true);
    axios.get(`${API}/api/products/${handle}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [handle]);

  return { product, loading, error };
};
