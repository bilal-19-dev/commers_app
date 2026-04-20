'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../data/FETCH.js';
import { URL } from '../data/URL.js';
import { ChevronLeftIcon, ChevronRightIcon } from '../data/Icons.jsx';
import { Use_them } from '../hooks/ThemProvider';
import { useRouter } from '@/app/navigation';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

// ─── المقاسات المتاحة ────────────────────────────────────────────
const SIZES = [
  { label: '38', available: true },
  { label: '39', available: true },
  { label: '40', available: true },
  { label: '41', available: true },
  { label: '42', available: true },
  { label: '43', available: false },
  { label: '44', available: true },
  { label: '45', available: false },
];

export default function Prodect_detail_component({ data }) {
  const t = useTranslations('product_detail');
  const toastT = useTranslations('toast');
  const { setmessge, setSeverity, setsnack, setCart } = Use_them();
  const router = useRouter();
  const [Loged, setLoged] = useState(false);
  const [ratingValue, setRatingValue] = useState(Math.round(data.rating ?? 0));
  const [review, setReview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [images, setImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState(2);
  const [loading, setLoading] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);

  const [form, setForm] = useState({
    size: SIZES[2].label,
    color: data?.colors?.[0]?.color || data?.colors?.[0]?.color_name || '',
    quantity: 1,
  });

  const scrollRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const max_quantity =
    data?.colors?.find((c) =>
      c.color ? c.color === form.color : c.color_name === form.color
    )?.quantity ?? 1;

  const handleClick = useCallback(
    (msg, sev) => {
      setmessge(msg);
      setSeverity(sev);
      setsnack(true);
    },
    [setmessge, setSeverity, setsnack]
  );
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoged(JSON.parse(localStorage.getItem('logeed')));
    }
  }, []);
  const get_user_review = useCallback(async () => {
    try {
      const res = await apiFetch(`https://${URL}/api/review/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return;
      const reviews = await res.json();
      const userReview = reviews.find((r) => r.product === data.id);
      if (userReview) setReview(userReview);
    } catch (_) {}
  }, [data.id]);

  const send_review = async (value) => {
    try {
      const res = await apiFetch(`https://${URL}/api/review/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: data.id, stars: value }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        handleClick(errorData.message || 'Error', 'error');
      } else {
        handleClick(toastT('review_sent_success'), 'success');
      }
    } catch (_) {
      handleClick(toastT('order_send_failed'), 'error');
    }
  };

  const delete_review = async () => {
    try {
      await apiFetch(
        `https://${URL}/api/review/delete_by_product/?product=${data.id}`,
        { method: 'DELETE' }
      );
      setReview(null);
      setRatingValue(Math.round(data.rating ?? 0));
      location.reload();
    } catch (_) {}
  };

  const hendel_add_car = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((i) => i.id === data.id && i.color === form.color);
    if (exists) {
      handleClick(toastT('item_already_in_cart'), 'warning');
      return;
    }
    const newItem = { id: data.id, quantity: form.quantity, color: form.color };
    const updated = [...cart, newItem];
    localStorage.setItem('cart', JSON.stringify(updated));
    setCart(updated);
    handleClick(toastT('item_added_to_cart'), 'success');
  };

  const handle_order_form = () => {
    const order_form = [{ order_info: form, prodect: data }];
    localStorage.removeItem('order_info');
    localStorage.setItem('order_info', JSON.stringify(order_form));
    router.push('/order_form');
  };

  useEffect(() => {
    const imgs = [
      data.primary_image,
      ...(data.secondary_images || []).map((im) => im.image),
    ];
    setImages(imgs);
  }, [data.primary_image, data.secondary_images]);

  useEffect(() => {
    get_user_review();
  }, [get_user_review]);

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
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? 240 : -240,
      behavior: 'smooth',
    });
  };

  const handlePrevImage = useCallback(() => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleTouchStart = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
    touchEndX.current = e.clientX;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
    const diffX = touchEndX.current - touchStartX.current;
    const diffY = e.clientY - touchStartY.current;
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffX) < 10) return;
    if (Math.abs(diffX) > 10) e.preventDefault();
    setDragOffset(diffX);
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isDragging.current) return;
      e.currentTarget.releasePointerCapture(e.pointerId);
      isDragging.current = false;
      const diff = touchEndX.current - touchStartX.current;
      setDragOffset(0);
      if (Math.abs(diff) > 50) {
        diff < 0 ? handleNextImage() : handlePrevImage();
      }
    },
    [handleNextImage, handlePrevImage]
  );

  const discountedPrice = (
    data.price -
    (data.price * (data.discount ?? 0)) / 100
  ).toFixed(2);
  const savedAmount = ((data.price * (data.discount ?? 0)) / 100).toFixed(1);

  return (
    <main>
      <div className="pro-detail">
        <div className="product-main animate-in">
          {/* ── معرض الصور ── */}
          <div className="gallery">
            <div
              className="gallery-main"
              onPointerDown={handleTouchStart}
              onPointerMove={handleTouchMove}
              onPointerUp={handleTouchEnd}
            >
              <div
                className="gallery-slider-track"
                style={{
                  transform: `translateX(${-selectedImage * 100}%) translateX(${dragOffset}px)`,
                }}
              >
                {images.map((img, index) => (
                  <div className="gallery-slide" key={index}>
                    <img
                      src={img}
                      alt={t('gallery.image_alt', { index: index + 1 })}
                      className={`gallery-slide-img ${img ? 'loaded' : ''}`}
                      loading={index <= 1 ? 'eager' : 'lazy'}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              {/* النقاط */}
              <div className="gallery-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`gallery-dot ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={t('gallery.image_alt', { index: index + 1 })}
                  />
                ))}
              </div>

              {/* الشارات */}
              {data.discount > 0 && (
                <div className="gallery-badges">
                  <span className="badge badge-sale">
                    {t('gallery.badge_sale', { discount: data.discount })}
                  </span>
                  <span className="badge badge-new">
                    {t('gallery.badge_new')}
                  </span>
                </div>
              )}

              {/* أزرار التنقل */}
              <button
                className="gallery-arrow gallery-arrow-right"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleNextImage}
              >
                <ChevronRightIcon />
              </button>
              <button
                className="gallery-arrow gallery-arrow-left"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handlePrevImage}
              >
                <ChevronLeftIcon />
              </button>

              <div className="gallery-counter">
                {selectedImage + 1} / {images.length}
              </div>
            </div>

            {/* الصور المصغرة */}
            <div className="gallery-thumbs-wrapper">
              <button
                className={`scroll-arrow-thumbs scroll-arrow-right ${!canScrollLeft ? 'hidden' : ''}`}
                onClick={() => scroll('left')}
                aria-label={t('gallery.scroll_forward')}
              >
                <ChevronRightIcon />
              </button>
              <div className="gallery-thumbs" ref={scrollRef}>
                {images.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    className={`gallery-thumb ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={t('gallery.thumbnail_alt', { index: index + 1 })}
                    />
                  </button>
                ))}
              </div>
              <button
                className={`scroll-arrow-thumbs scroll-arrow-left ${!canScrollRight ? 'hidden' : ''}`}
                onClick={() => scroll('right')}
                aria-label={t('gallery.scroll_back')}
              >
                <ChevronLeftIcon />
              </button>
            </div>
          </div>

          {/* ── معلومات المنتج ── */}
          <div className="product-info">
            <h1 className="product-title">{data.name}</h1>

            {/* التقييم */}
            <div className="product-rating">
              <span className="rating-text">
                <strong>{data.rating?.toFixed(1)}</strong> {t('rating.out_of')}
              </span>
              <span className="divider">|</span>
              <span
                className="rating-text"
                style={{ color: review ? 'green' : '' }}
              >
                {data.reviews_count} {t('rating.reviews')}
              </span>
              <span className="divider">|</span>
              <span className="rating-text">
                {data.sales} {t('rating.sales')}
              </span>
            </div>

            {!Loged ? (
              <Rating name="read-only" value={ratingValue} readOnly />
            ) : (
              <Box
                sx={{
                  '& > legend': { mt: 0 },
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Rating
                  name="product-rating"
                  value={review ? Math.floor(review.stars) : ratingValue}
                  dir="ltr"
                  onChange={(_, newValue) => {
                    setRatingValue(newValue);
                    send_review(newValue);
                    location.reload();
                  }}
                />
                {review && (
                  <button onClick={delete_review} className="rev_butn">
                    x
                  </button>
                )}
              </Box>
            )}

            {/* السعر */}
            <div className="product-price-section">
              <span className="current-price">
                {discountedPrice} {t('price.currency')}
              </span>
              {data.discount > 0 && (
                <span className="original-price">
                  {data.price} {t('price.currency')}
                </span>
              )}
              {data.discount > 0 && (
                <span className="discount-percent">
                  {t('price.save', { amount: savedAmount })}
                </span>
              )}
            </div>

            <p className="product-description">{data.description}</p>

            {/* اختيار اللون */}
            <div className="option-group">
              <div className="option-label">
                {t('color.label')}: <span>{form.color}</span>
              </div>
              <div className="color-options">
                {data?.colors?.map((color) => {
                  const colorVal = color.color || color.color_name;
                  if (!color.color) return null;
                  return (
                    <button
                      key={colorVal}
                      className={`color-swatch ${form.color === colorVal ? 'active' : ''}`}
                      style={{ backgroundColor: colorVal }}
                      onClick={() =>
                        setForm({ ...form, color: colorVal, quantity: 1 })
                      }
                      title={colorVal}
                    />
                  );
                })}
              </div>
            </div>

            {/* اختيار المقاس */}
            <div className="option-group">
              <div className="option-label">
                {t('size.label')}:{' '}
                <span>
                  {SIZES[selectedSize].label} {t('size.unit')}
                </span>
              </div>
              <div className="size-options">
                {SIZES.map((size, index) => (
                  <button
                    key={size.label}
                    className={`size-btn ${selectedSize === index ? 'active' : ''} ${!size.available ? 'disabled' : ''}`}
                    onClick={() => size.available && setSelectedSize(index)}
                    disabled={!size.available}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* الكمية */}
            <div className="quantity-section">
              <div className="option-label" style={{ marginBottom: 0 }}>
                {t('quantity.label')}:
              </div>
              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      quantity: Math.max(1, prev.quantity - 1),
                    }))
                  }
                  disabled={form.quantity <= 1}
                >
                  −
                </button>
                <div className="qty-value">{form.quantity}</div>
                <button
                  className="qty-btn"
                  onClick={() => {
                    if (form.quantity >= max_quantity) {
                      handleClick(toastT('quantity_unavailable'), 'warning');
                      return;
                    }
                    setForm((prev) => ({
                      ...prev,
                      quantity: prev.quantity + 1,
                    }));
                  }}
                  disabled={form.quantity >= max_quantity}
                >
                  +
                </button>
              </div>
              {max_quantity <= 5 && max_quantity > 0 && (
                <div className="stock-info low">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                      verticalAlign: 'middle',
                      marginInlineEnd: 4,
                      width: '15px',
                    }}
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span>
                    {t('quantity.low_stock', { count: max_quantity })}
                  </span>
                </div>
              )}
              {max_quantity === 0 && (
                <div className="stock-info low" style={{ color: '#ff4444' }}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{
                      verticalAlign: 'middle',
                      marginInlineEnd: 4,
                      width: '15px',
                    }}
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span>{t('quantity.out_of_stock')}</span>
                </div>
              )}
            </div>

            {/* أزرار الإجراءات */}
            <div className="action-buttons">
              <button className="btn btn-car" onClick={hendel_add_car}>
                <span className="material-symbols-outlined">
                  add_shopping_cart
                </span>
                {t('buttons.add_to_cart')}
              </button>
              <button
                className="btn btn-buy"
                onClick={() => {
                  setLoading(true);
                  handle_order_form();
                }}
                disabled={loading}
              >
                {loading ? (
                  <svg className="spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      style={{ opacity: 0.25 }}
                    />
                    <path
                      fill="white"
                      style={{ opacity: 0.75 }}
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  t('buttons.buy_now')
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
