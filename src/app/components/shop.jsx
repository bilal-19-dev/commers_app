'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { URL } from '../data/URL.js';
import { Link } from '@/app/navigation';
import { useTranslations } from 'next-intl';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  CloseIcon,
  FilterIcon,
  SortIcon,
} from '../data/Icons.jsx';
import { Use_them } from '../hooks/ThemProvider';
// ─── ثوابت خارج المكوّن ──────────────────────────────────────────
const COMPARATORS = {
  min_price: (a, b) => a.price < b.price,
  max_price: (a, b) => a.price > b.price,
  rating: (a, b) => a.rating > b.rating,
  reviews: (a, b) => a.reviews_count > b.reviews_count,
  newest: (a, b) => Date.parse(a.created_at) > Date.parse(b.created_at),
  oldest: (a, b) => Date.parse(a.created_at) < Date.parse(b.created_at),
};

const DEFAULT_PRICE_RANGE = [0, 500000];

// ─── Merge Sort ───────────────────────────────────────────────────
function mergeSortProducts(arr, sortOption) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSortProducts(arr.slice(0, mid), sortOption);
  const right = mergeSortProducts(arr.slice(mid), sortOption);
  return mergeProducts(left, right, sortOption);
}

function mergeProducts(left, right, sortOption) {
  const result = [];
  let i = 0,
    j = 0;
  while (i < left.length && j < right.length) {
    if (COMPARATORS[sortOption](left[i], right[j])) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// ─── بطاقة المنتج ────────────────────────────────────────────────
const SORT_LABELS_KEYS = [
  'default',
  'max_price',
  'min_price',
  'rating',
  'reviews',
  'newest',
  'oldest',
];

const Product_Card = ({
  id,
  title,
  subtitle,
  price,
  image,
  colors = [],
  sizes,
  inStock = true,
  t,
  hendel_add_car,
}) => (
  <Link href={`/prodect_detail/${id}`}>
    <div className="product-card">
      <div className="card-image-wrapper">
        <img src={image} alt={title} className="card-image" />
        {inStock && <span className="badge">{t('product_card.in_stock')}</span>}
      </div>
      <div className="card-content">
        <h3 className="product-title">{title}</h3>
        {subtitle && <p className="product-subtitle">{subtitle}</p>}
        <p className="product-price">
          {price} {t('product_card.currency')}
        </p>
        <div className="options-container">
          <div className="color-options">
            {colors.map((color, index) =>
              color?.color ? (
                <span
                  key={index}
                  className="color-dot"
                  style={{ backgroundColor: color.color }}
                  title={color.color}
                />
              ) : null
            )}
          </div>
          {Array.isArray(sizes) && (
            <div className="size-options">
              {sizes.map((size, index) => (
                <span key={index} className="size-option">
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          className="add-to-cart-btn"
          aria-label={t('product_card.add_to_cart')}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => hendel_add_car(id, colors[0]?.color, 1)}
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
        </button>
      </div>
    </div>
  </Link>
);

export default function Shop_commponent({ data }) {
  const t = useTranslations('shop');
  const toastT = useTranslations('toast');
  const SORT_LABELS = Object.fromEntries(
    SORT_LABELS_KEYS.map((key) => [key, t(`sort.${key}`)])
  );
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(data);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [minRating, setMinRating] = useState(0);
  const [selectedBadges, setSelectedBadges] = useState(new Set());
  const [sortOption, setSortOption] = useState('default');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { setmessge, setSeverity, setsnack, setCart } = Use_them();
  const scrollRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const activeFiltersCount =
    (priceRange[0] > 0 || priceRange[1] < 500000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (selectedBadges.size > 0 ? 1 : 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`http://${URL}/api/categories/`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        setCategories(await res.json());
      } catch (_) {}
    };
    fetchCategories();
  }, []);
  const handleClick = useCallback(
    (msg, sev) => {
      setmessge(msg);
      setSeverity(sev);
      setsnack(true);
    },
    [setmessge, setSeverity, setsnack]
  );
  const hendel_add_car = (id, color, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((i) => i.id === id && i.color === color);
    if (exists) {
      handleClick(toastT('item_already_in_cart'), 'error');
      return;
    }
    const newItem = { id: id, quantity: quantity, color: color };
    const updated = [...cart, newItem];
    localStorage.setItem('cart', JSON.stringify(updated));
    handleClick(toastT('item_added_to_cart'), 'success');
    setCart(updated);
  };

  useEffect(() => {
    if (!sortDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target)
      )
        setSortDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sortDropdownOpen]);

  const filterAndSort = useCallback(() => {
    const filtered = data.filter((product) => {
      const matchesCategory =
        activeCategory === 0 || product.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBadges =
        selectedBadges.size === 0 || selectedBadges.has(product.category);
      const matchesRating = minRating === 0 || product.rating >= minRating;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return (
        matchesCategory &&
        matchesSearch &&
        matchesBadges &&
        matchesRating &&
        matchesPrice
      );
    });
    return sortOption === 'default'
      ? filtered
      : mergeSortProducts(filtered, sortOption);
  }, [
    data,
    activeCategory,
    searchQuery,
    selectedBadges,
    minRating,
    priceRange,
    sortOption,
  ]);

  useEffect(() => {
    setProducts(filterAndSort());
  }, [filterAndSort]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    // استخدام 1 بكسل كهامش خطأ للتعامل مع الشاشات المختلفة
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < maxScroll - 1);
  }, []);
  useEffect(() => {
    requestAnimationFrame(checkScroll);
  }, [categories, checkScroll, canScrollLeft, canScrollRight]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // تحديث الحالة عند التمرير اليدوي
    el.addEventListener('scroll', checkScroll);

    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);

    // تشغيل أولي
    checkScroll();

    return () => {
      el.removeEventListener('scroll', checkScroll);
      observer.disconnect();
    };
  }, [checkScroll, categories]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    // اليمين موجب واليسار سالب (أو العكس حسب اتجاه اللغة LTR/RTL)
    const offset = direction === 'left' ? -240 : 240;
    el.scrollBy({
      left: offset,
      behavior: 'smooth',
    });
  };

  const resetFilters = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setMinRating(0);
    setSelectedBadges(new Set());
  };

  const handleToggleBadge = (badge) => {
    setSelectedBadges((prev) => {
      const next = new Set(prev);
      next.has(badge) ? next.delete(badge) : next.add(badge);
      return next;
    });
  };

  const BADGES = [
    { key: 'new', label: t('filter.badges.new') },
    { key: 'sale', label: t('filter.badges.sale') },
    { key: 'hot', label: t('filter.badges.hot') },
    { key: 'none', label: t('filter.badges.none') },
  ];

  return (
    <main>
      <div className="shop-container">
        {/* Hero */}
        <section className="shop-hero">
          <div className="hero-content">
            <h1>{t('hero.title')}</h1>
            <p>{t('hero.subtitle')}</p>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">
                  {t('hero.stats.products')}
                </div>
                <div className="hero-stat-label">
                  {t('hero.stats.products_label')}
                </div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">
                  {t('hero.stats.customers')}
                </div>
                <div className="hero-stat-label">
                  {t('hero.stats.customers_label')}
                </div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">{t('hero.stats.rating')}</div>
                <div className="hero-stat-label">
                  {t('hero.stats.rating_label')}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="main-container">
          {/* التصنيفات */}
          <div className="section-header">
            <h2 className="section-title">{t('categories.section_title')}</h2>
          </div>
          <div className="categories-scroll-wrapper">
            <button
              className={`scroll-arrow scroll-arrow-left ${!canScrollLeft ? 'hidden' : ''}`}
              onClick={() => scroll('left')}
            >
              <ChevronLeftIcon />
            </button>
            <div className="categories-scroll" ref={scrollRef}>
              <button
                className={`category-scroll-btn ${activeCategory === 0 ? 'active' : ''}`}
                onClick={() => setActiveCategory(0)}
                style={{ '--cat-color': 'black' }}
              >
                <span className="category-scroll-name">
                  {t('categories.all')}
                </span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-scroll-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ '--cat-color': cat.color }}
                >
                  <span className="category-scroll-name">{cat.name}</span>
                </button>
              ))}
            </div>
            <button
              className={`scroll-arrow scroll-arrow-right ${!canScrollRight ? 'hidden' : ''}`}
              onClick={() => scroll('right')}
            >
              <ChevronRightIcon />
            </button>
          </div>

          {/* شريط الأدوات */}
          <div className="toolbar">
            <div className="toolbar-search">
              <span className="toolbar-search-icon">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder={t('toolbar.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="toolbar-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            <div className="toolbar-actions">
              <button
                className={`toolbar-btn filter-btn ${filterPanelOpen ? 'active' : ''}`}
                onClick={() => setFilterPanelOpen((p) => !p)}
              >
                <FilterIcon />
                <span className="toolbar-btn-text">
                  {t('toolbar.filter_btn')}
                </span>
                {activeFiltersCount > 0 && (
                  <span className="toolbar-btn-badge">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="sort-dropdown-wrapper" ref={sortDropdownRef}>
                <button
                  className={`toolbar-btn sort-btn ${sortDropdownOpen ? 'active' : ''}`}
                  onClick={() => setSortDropdownOpen((p) => !p)}
                >
                  <SortIcon />
                  <span className="toolbar-btn-text">
                    {SORT_LABELS[sortOption]}
                  </span>
                  <span className="sort-arrow">
                    {sortDropdownOpen ? '▲' : '▼'}
                  </span>
                </button>
                {sortDropdownOpen && (
                  <div className="sort-dropdown">
                    {Object.entries(SORT_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        className={`sort-option ${sortOption === key ? 'active' : ''}`}
                        onClick={() => {
                          setSortOption(key);
                          setSortDropdownOpen(false);
                        }}
                      >
                        {sortOption === key && (
                          <span className="sort-check">✓</span>
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* لوحة الفلتر */}
            {filterPanelOpen && (
              <div className="filter-panel">
                <div className="filter-panel-header">
                  <h3>
                    <FilterIcon /> {t('filter.title')}
                  </h3>
                  <div className="filter-panel-actions">
                    <button className="filter-reset-btn" onClick={resetFilters}>
                      {t('filter.reset')}
                    </button>
                    <button
                      className="filter-close-btn"
                      onClick={() => setFilterPanelOpen(false)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>

                <div className="filter-panel-body">
                  {/* نطاق السعر */}
                  <div className="filter-group">
                    <h4 className="filter-group-title">
                      {t('filter.price_range')}
                    </h4>
                    <div className="price-range-display">
                      <span className="price-tag">
                        {priceRange[0]} {t('filter.price_currency')}
                      </span>
                      <span className="price-separator">—</span>
                      <span className="price-tag">
                        {priceRange[1]} {t('filter.price_currency')}
                      </span>
                    </div>
                    <div className="price-inputs">
                      <div className="price-input-group">
                        <label>{t('filter.price_from')}</label>
                        <input
                          type="number"
                          min="0"
                          max={priceRange[1]}
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([
                              Number(e.target.value),
                              priceRange[1],
                            ])
                          }
                        />
                      </div>
                      <div className="price-input-group">
                        <label>{t('filter.price_to')}</label>
                        <input
                          type="number"
                          min={priceRange[0]}
                          max="5000"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              Number(e.target.value),
                            ])
                          }
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="price-slider"
                    />
                  </div>

                  {/* التقييم */}
                  <div className="filter-group">
                    <h4 className="filter-group-title">
                      {t('filter.rating_title')}
                    </h4>
                    <div className="rating-options">
                      {[0, 3, 3.5, 4, 4.5].map((r) => (
                        <button
                          key={r}
                          className={`rating-filter-btn ${minRating === r ? 'active' : ''}`}
                          onClick={() => setMinRating(r)}
                        >
                          {r === 0 ? (
                            t('filter.rating_all')
                          ) : (
                            <>
                              {r}+{' '}
                              <span className="rating-stars">
                                {'★'.repeat(Math.floor(r))}
                              </span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* نوع المنتج */}
                  <div className="filter-group">
                    <h4 className="filter-group-title">
                      {t('filter.product_type_title')}
                    </h4>
                    <div className="badge-options">
                      {BADGES.map(({ key, label }) => (
                        <button
                          key={key}
                          className={`badge-filter-btn ${selectedBadges.has(key) ? `active ${key}` : ''}`}
                          onClick={() => handleToggleBadge(key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* شريط الفلاتر النشطة */}
          {(searchQuery ||
            activeCategory !== 0 ||
            activeFiltersCount > 0 ||
            sortOption !== 'default') && (
            <div className="results-bar">
              <div className="active-filters-tags">
                {searchQuery && (
                  <span className="filter-tag">
                    {t('active_filters.search_label', { query: searchQuery })}
                    <button onClick={() => setSearchQuery('')}>
                      <CloseIcon />
                    </button>
                  </span>
                )}
                {activeCategory !== 0 && (
                  <span className="filter-tag">
                    {t('active_filters.category_label', {
                      name:
                        categories.find((cat) => cat.id === activeCategory)
                          ?.name || '',
                    })}
                    <button onClick={() => setActiveCategory(0)}>
                      <CloseIcon />
                    </button>
                  </span>
                )}
                {sortOption !== 'default' && (
                  <span className="filter-tag">
                    {t('active_filters.sort_label', {
                      sort: SORT_LABELS[sortOption],
                    })}
                    <button onClick={() => setSortOption('default')}>
                      <CloseIcon />
                    </button>
                  </span>
                )}
                {activeFiltersCount > 0 && (
                  <span className="filter-tag">
                    {t('active_filters.filters_count', {
                      count: activeFiltersCount,
                    })}
                    <button onClick={resetFilters}>
                      <CloseIcon />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* شبكة المنتجات */}
          <div className="products-grid">
            {products?.map((item) => (
              <Product_Card
                key={item.id}
                id={item.id}
                title={item.name}
                subtitle={item.subtitle}
                price={item.price}
                image={item.primary_image}
                colors={item.colors}
                sizes={item.sizes}
                t={t}
                hendel_add_car={() =>
                  hendel_add_car(item.id, item.colors[0]?.color, 1)
                }
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
