"use client";
import { useState, useEffect, useCallback } from "react";
import { URL } from "../data/URL.js";
import { Use_them } from "../hooks/ThemProvider";
import { useRouter } from "@/app/navigation";
import { useTranslations } from "next-intl";

export default function Car_component() {
  const t = useTranslations("cart");
  const toastT = useTranslations("toast");
  const [items, setItems] = useState();
  const [loading, setLoading] = useState(false);
  const [products, setproducts] = useState();
  const { setmessge, setSeverity, setsnack, setCart } = Use_them();
  const router = useRouter();

  const handleClick = useCallback(
    (msg, sev) => {
      setmessge(msg);
      setSeverity(sev);
      setsnack(true);
    },
    [setmessge, setSeverity, setsnack],
  );

  async function fetchProducts(silent = false) {
    if (!silent) setLoading(true); // ابدأ التحميل

    const productsInCart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (productsInCart.length === 0) {
      setItems(undefined);
      setLoading(false);
      return;
    }

    const ids = [...new Set(productsInCart.map((item) => item.id))];

    try {
      const res = await fetch(`http://${URL}:8000/api/products/by-ids/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) throw new Error("Fetch failed");

      const fetchedProducts = await res.json();
      setproducts(fetchedProducts);

      // بناء قائمة العناصر بناءً على ما في السلة حالياً
      const itemsList = productsInCart.map(cartItem => {
        const product = fetchedProducts.find(p => p.id === cartItem.id);
        if (!product) return null;
  
        const colorInfo = product.colors.find(c => (c.color || c.color_name) === cartItem.color);
        
        return {
              id: product.id,
              product: product.primary_image,
              name: product.name,
          color: cartItem.color,
              price: product.price,
          size: cartItem.size || "/",
          stock: colorInfo ? colorInfo.quantity : 0,
          quantity: cartItem.quantity,
        };
      }).filter(Boolean); // إزالة العناصر الفارغة
  
      setItems(itemsList);
    } catch (error) {
      console.error(error);
      handleClick(toastT("order_send_failed"), "error");
    } finally {
      setLoading(false); // إنهاء التحميل في كل الحالات
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handle_order_form() {
    const order_form = items?.map((item) => ({
      order_info: {
        color: item.color,
        size: "3",
        quantity: item.quantity,
      },
      prodect: products.find((pro) => pro.id === item.id),
    }));

    localStorage.removeItem("order_info");
    localStorage.setItem("order_info", JSON.stringify(order_form));
    router.push("/order_form");
  }

  function edit_car(i, operation, input) {
    const productsInCart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (operation === "color") {
      const isDuplicate = productsInCart.some(
        (product, x) =>
          x !== i &&
          product.id === productsInCart[i].id &&
          product.color === input
      );
      if (isDuplicate) {
        handleClick(toastT("item_already_in_cart"), "warning");
        return;
      }
    }

    const updatedCart = productsInCart.map((item, x) => {
      if (x !== i) return item;
      return { ...item, [operation]: input };
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    // تحديث حالة items فوراً لضمان عدم اختفاء العنصر
    const updatedItems = items.map((item, x) => {
      if (x !== i) return item;
      
      // إذا تغير اللون، نحتاج لتحديث الـ stock من بيانات الـ products الأصلية
      let newStock = item.stock;
      if (operation === "color") {
        const product = products.find(p => p.id === item.id);
        const colorInfo = product?.colors.find(c => (c.color || c.color_name) === input);
        newStock = colorInfo ? colorInfo.quantity : 0;
      }
  
      return { ...item, [operation]: input, stock: newStock };
    });
  
    setItems(updatedItems);
    // اختياري: يمكنك استدعاء fetchProducts(true) للتأكد من المزامنة مع السيرفر
  }

  function hendel_delet_car(i) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const deletedItem = items[i];
    const index = cart.findIndex(
      (item) =>
        item.id === deletedItem?.id && item.color === deletedItem?.color,
    );

    if (index === -1) {
      handleClick(toastT("delete_cart_item_failed"), "error");
      return;
    }

    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    setCart(cart);

    const newItems = items.filter(
      (item) =>
        !(item.id === deletedItem?.id && item.color === deletedItem?.color),
    );

    setItems(newItems.length > 0 ? newItems : undefined);
    handleClick(toastT("item_removed_from_cart_success"), "success");
  }

  function hendel_add_btn(i) {
    if (items[i].quantity < items[i].stock) {
      const updated = items.map((item, x) => {
        if (x !== i) return item;
        edit_car(i, "quantity", item.quantity + 1);
        return { ...item, quantity: item.quantity + 1 };
      });
      setItems(updated);
    } else {
      handleClick(toastT("quantity_unavailable"), "warning");
    }
  }

  function hendel_minus_btn(i) {
    if (items[i].quantity <= 1) {
      handleClick(toastT("quantity_invalid_or_remove"), "warning");
      return;
    }

    const updated = items.map((item, x) => {
      if (x !== i) return item;
      edit_car(i, "quantity", item.quantity - 1);
      return { ...item, quantity: item.quantity - 1 };
    });

    setItems(updated);
  }

  const discount = 0;
  const subtotal = items
    ?.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    .toFixed(2);
  const discountAmount = subtotal * (discount / 100);
  const total = (Number(subtotal) - discountAmount).toFixed(2);
  const totalQuantity = items?.reduce((sum, item) => sum + item.quantity, 0);

  const Spinner = () => (
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
  );

  if (loading && (!items || items.length === 0)) {
    return <div className="loading-screen"><Spinner /></div>;
  }

  if (!items) {
    return (
      <main>
        <div className="cart-page">
          <div className="cart-container">
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>{t("empty.title")}</h2>
              <p>{t("empty.subtitle")}</p>
              <button
                className="continue-shopping-btn"
                onClick={() => router.push("/shop")}
              >
                {t("empty.back_btn")}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="cart-page">
        <div className="cart-container">
          {/* Header */}
          <div className="cart-header">
            <div className="cart-icon">🛍️</div>
            <h1>{t("header.title")}</h1>
            <p>{t("header.items_count", { count: totalQuantity })}</p>
          </div>

          <a onClick={() => router.push("/shop")} className="continue-link">
            {t("continue_shopping")}
          </a>

          <div className="cart-content">
            {/* قائمة المنتجات */}
            <div className="cart-items-section">
              <h2 className="section-title">{t("selected_products")}</h2>
              <div className="cart-items-list">
                {items.map((item, i) => (
                  <div key={`${item.id}-${item.color}`} className="cart-item">
                    <div className="item-image">
                      <img src={item.product} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <div className="item-info">
                        <h3>{item.name}</h3>
                        <p className="item-price">
                          {item.price} {t("currency")}
                        </p>
                      </div>
                      <div className="item-actions">
                        {/* التحكم بالكمية */}
                        <div className="quantity-control">
                          <button
                            className="quantity-btn"
                            onClick={() => hendel_minus_btn(i)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="quantity-value">
                            {item.quantity}
                          </span>
                          <button
                            className="quantity-btn"
                            onClick={() => hendel_add_btn(i)}
                          >
                            +
                          </button>
                        </div>

                        {/* اختيار اللون */}
                        <select
                          className="Size_Color"
                          value={item.color}
                          onChange={(e) => edit_car(i, "color", e.target.value)}
                        >
                          {products
                            ?.find((p) => p.id === item.id)
                            ?.colors.map((color, ci) => {
                              const val = color.color || color.color_name;
                              return (
                                <option key={ci} value={val}>
                                  {val}
                                </option>
                              );
                            })}
                        </select>

                        {/* زر الحذف */}
                        <button
                          className="remove-btn"
                          onClick={() => hendel_delet_car(i)}
                        >
                          {t("remove_btn")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ملخص الطلبية */}
            <div className="order-summary">
              <h2 className="summary-title">{t("summary.title")}</h2>

              <div className="summary-row">
                <span>{t("summary.subtotal")}</span>
                <span>
                  {subtotal} {t("currency")}
                </span>
              </div>

              <div className="summary-row">
                <span>{t("summary.shipping")}</span>
                <span>{t("summary.shipping_free")}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount">
                  <span>{t("summary.discount", { discount })}</span>
                  <span>
                    -{discountAmount.toFixed(2)} {t("currency")}
                  </span>
                </div>
              )}

              <div className="summary-row total">
                <span>{t("summary.total")}</span>
                <span>
                  {total} {t("currency")}
                </span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => {
                  setLoading(true);
                  handle_order_form();
                }}
              >
                {loading ? <Spinner /> : t("summary.checkout_btn")}
              </button>

              <div className="secure-note">{t("summary.secure_note")}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
