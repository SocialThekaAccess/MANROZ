import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A-Z', value: 'name_asc' },
];

const Shop = () => {
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');

  const selectedCategory = searchParams.get('category') || 'All';

  const allCategories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ['All', ...cats];
  }, [products]);

  const setCategory = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const filtered = useMemo(() => {
    // Show all except archived — soldout products show with badge
    let list = products.filter((p) => p.status !== 'archived');

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price_asc':  return [...list].sort((a, b) => a.basePrice - b.basePrice);
      case 'price_desc': return [...list].sort((a, b) => b.basePrice - a.basePrice);
      case 'name_asc':   return [...list].sort((a, b) => a.title.localeCompare(b.title));
      default:           return list;
    }
  }, [products, selectedCategory, sort, search]);

  return (
    <main className="shop-page">
      <div className="shop-header">
        <h1>Shop</h1>
        <p>{loading ? '...' : `${filtered.length} products`}</p>
      </div>

      <div className="shop-search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <div className="filter-group">
            <h4>Category</h4>
            <ul className="filter-list">
              {allCategories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="shop-content">
          <div className="shop-toolbar">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="empty-state"><p>Loading products...</p></div>
          ) : error ? (
            <div className="empty-state"><p>{error}</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><p>No products found. Try a different filter.</p></div>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => (
                <ProductCard key={p._id || p.handle} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Shop;
