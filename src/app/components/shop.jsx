"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { URL } from "../data/URL.js";
import { Link } from "@/app/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  CloseIcon,
  FilterIcon,
  SortIcon,
} from "../data/Icons.jsx";

const Product_Card = ({
  id,
  title,
  subtitle,
  price,
  image,
  colors = [],
  sizes,
  inStock = true,
}) => {
  return (
    <Link href={`/prodect_detail/${id}`}>
      <div className="product-card">
        <div className="card-image-wrapper">
          <img src={image} alt={title} className="card-image" />
          {inStock && <span className="badge">in stock</span>}
        </div>
        <div className="card-content">
          <h3 className="product-title">{title}</h3>
          <p className="product-subtitle">{subtitle}</p>
          <p className="product-price">{price} DZ</p>

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
                ) : null,
              )}
            </div>

            <div className="size-options">
              {sizes
                ? sizes.map((size, index) => (
                    <span key={index} className="size-option">
                      {size}
                    </span>
                  ))
                : sizes}
            </div>
          </div>

          <button className="add-to-cart-btn" aria-label="Add to cart">
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default function Shop_commponent({ data }) {
  const [Category,setCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedBadges, setSelectedBadges] = useState(new Set());
  const [sortOption, setSortOption] = useState("default");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const scrollRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const sortLabels = {
    default: "الترتيب الافتراضي",
    "price-asc": "السعر: من الأقل للأعلى",
    "price-desc": "السعر: من الأعلى للأقل",
    rating: "الأعلى تقييماً",
    reviews: "الأكثر مراجعات",
    newest: "الأحدث أولاً",
  };
  const fatcheCategory = async () => {
    try {
      const response = await fetch(`http://${URL}:8000/api/categories/`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      console.log(data);
      setCategory(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fatcheCategory();
  }, []);
  useEffect(() => {
    let count = 0;
    if (priceRange[0] > 0 || priceRange[1] < 5000) count++;
    if (minRating > 0) count++;
    if (selectedBadges.size > 0) count++;
    setActiveFiltersCount(count);
  }, [priceRange, minRating, selectedBadges]);
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = Math.abs(el.scrollLeft);
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollRight(scrollLeft > 1);
    setCanScrollLeft(scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 240;
    if (direction === "left") {
      el.scrollBy({ left: amount, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -amount, behavior: "smooth" });
    }
  };
  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setMinRating(0);
    setSelectedBadges(new Set());
  };
  const handleToggleBadge = (badge) => {
    setSelectedBadges((prev) => {
      const next = new Set(prev);
      if (next.has(badge)) {
        next.delete(badge);
      } else {
        next.add(badge);
      }
      return next;
    });
  };
  return (
    <main>
      <div className="shop-container">
        <section className="shop-hero">
          <div className="hero-content">
            <h1>اكتشف أفضل المنتجات بأسعار مذهلة</h1>
            <p>
              تسوّق الآن واستمتع بعروض حصرية وخصومات تصل إلى 50% على أفضل
              المنتجات العالمية
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">+5000</div>
                <div className="hero-stat-label">منتج متاح</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">+10K</div>
                <div className="hero-stat-label">عميل سعيد</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">4.9⭐</div>
                <div className="hero-stat-label">تقييم المتجر</div>
              </div>
            </div>
          </div>
        </section>
        <section className="main-container">
          <div className="section-header">
            <h2 className="section-title">تصفح الأقسام</h2>
          </div>
          <div className="categories-scroll-wrapper">
            <button
              className={`scroll-arrow scroll-arrow-right ${!canScrollLeft ? "hidden" : ""}`}
              onClick={() => scroll("left")}
              aria-label="تمرير للأمام"
            >
              <ChevronRightIcon />
            </button>

            <div className="categories-scroll" ref={scrollRef}>
              {Category.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-scroll-btn ${activeCategory === cat.name ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.name)}
                  style={{
                    "--cat-color": cat.color,
                  }}
                >
                  <span className="category-scroll-name">{cat.name}</span>
                </button>
              ))}
            </div>
            <button
              className={`scroll-arrow scroll-arrow-left ${!canScrollRight ? "hidden" : ""}`}
              onClick={() => scroll("right")}
              aria-label="تمرير للخلف"
            >
              <ChevronLeftIcon />
            </button>
          </div>
          <div className="toolbar">
            <div className="toolbar-search">
              <span className="toolbar-search-icon">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="ابحث في المنتجات بالاسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="toolbar-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
            <div className="toolbar-actions">
              <button
                className={`toolbar-btn filter-btn ${filterPanelOpen ? "active" : ""}`}
                onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              >
                <FilterIcon />
                <span className="toolbar-btn-text">الفلتر</span>
                {activeFiltersCount > 0 && (
                  <span className="toolbar-btn-badge">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <div className="sort-dropdown-wrapper" ref={sortDropdownRef}>
                <button
                  className={`toolbar-btn sort-btn ${sortDropdownOpen ? "active" : ""}`}
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                >
                  <SortIcon />
                  <span className="toolbar-btn-text">
                    {sortLabels[sortOption]}
                  </span>
                  <span className="sort-arrow">
                    {sortDropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {sortDropdownOpen && (
                  <div className="sort-dropdown">
                    {Object.keys(sortLabels).map((key) => (
                      <button
                        key={key}
                        className={`sort-option ${sortOption === key ? "active" : ""}`}
                        onClick={() => {
                          setSortOption(key);
                          setSortDropdownOpen(false);
                        }}
                      >
                        {sortOption === key && (
                          <span className="sort-check">✓</span>
                        )}
                        {sortLabels[key]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {filterPanelOpen && (
              <div className="filter-panel">
                <div className="filter-panel-header">
                  <h3>
                    <FilterIcon /> خيارات الفلتر
                  </h3>
                  <div className="filter-panel-actions">
                    <button className="filter-reset-btn" onClick={resetFilters}>
                      إعادة تعيين
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
                  <div className="filter-group">
                    <h4 className="filter-group-title">💰 نطاق السعر</h4>
                    <div className="price-range-display">
                      <span className="price-tag">{priceRange[0]} ر.س</span>
                      <span className="price-separator">—</span>
                      <span className="price-tag">{priceRange[1]} ر.س</span>
                    </div>
                    <div className="price-inputs">
                      <div className="price-input-group">
                        <label>من</label>
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
                        <label>إلى</label>
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

                  <div className="filter-group">
                    <h4 className="filter-group-title">
                      ⭐ الحد الأدنى للتقييم
                    </h4>
                    <div className="rating-options">
                      {[0, 3, 3.5, 4, 4.5].map((r) => (
                        <button
                          key={r}
                          className={`rating-filter-btn ${minRating === r ? "active" : ""}`}
                          onClick={() => setMinRating(r)}
                        >
                          {r === 0 ? (
                            "الكل"
                          ) : (
                            <>
                              {r}+{" "}
                              <span className="rating-stars">
                                {"★".repeat(Math.floor(r))}
                              </span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="filter-group">
                    <h4 className="filter-group-title">🏷️ نوع المنتج</h4>
                    <div className="badge-options">
                      <button
                        className={`badge-filter-btn ${selectedBadges.has("new") ? "active new" : ""}`}
                        onClick={() => handleToggleBadge("new")}
                      >
                        🆕 جديد
                      </button>
                      <button
                        className={`badge-filter-btn ${selectedBadges.has("sale") ? "active sale" : ""}`}
                        onClick={() => handleToggleBadge("sale")}
                      >
                        🔖 خصم
                      </button>
                      <button
                        className={`badge-filter-btn ${selectedBadges.has("hot") ? "active hot" : ""}`}
                        onClick={() => handleToggleBadge("hot")}
                      >
                        🔥 رائج
                      </button>
                      <button
                        className={`badge-filter-btn ${selectedBadges.has("none") ? "active none" : ""}`}
                        onClick={() => handleToggleBadge("none")}
                      >
                        📦 عادي
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="results-bar">
            {(searchQuery ||
              activeCategory !== "الكل" ||
              activeFiltersCount > 0 ||
              sortOption !== "default") && (
              <div className="active-filters-tags">
                {searchQuery && (
                  <span className="filter-tag">
                    🔍 &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")}>
                      <CloseIcon />
                    </button>
                  </span>
                )}
                {activeCategory !== "الكل" && (
                  <span className="filter-tag">
                    📂 {activeCategory}
                    <button onClick={() => setActiveCategory("الكل")}>
                      <CloseIcon />
                    </button>
                  </span>
                )}
                {sortOption !== "default" && (
                  <span className="filter-tag">
                    📊 {sortLabels[sortOption]}
                    <button onClick={() => setSortOption("default")}>
                      <CloseIcon />
                    </button>
                  </span>
                )}
                {activeFiltersCount > 0 && (
                  <span className="filter-tag">
                    🔧 {activeFiltersCount} فلتر نشط
                    <button onClick={resetFilters}>
                      <CloseIcon />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="products-grid">
            {data.map((item) => {
              return (
                <Product_Card
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  subtitle={item.subtitle ? item.subtitle : ""}
                  price={item.price}
                  image={item.primary_image}
                  colors={item.colors}
                  sizes={item.sizes ? item.sizes : ""}
                  inStock={true}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
