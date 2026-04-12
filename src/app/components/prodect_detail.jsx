"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Account, apiFetch } from "../data/FETCH.js";
import { WILAYAS_DATA } from "../data/Wilaya.js";
import { URL } from "../data/URL.js";
import { ChevronLeftIcon, ChevronRightIcon } from "../data/Icons.jsx";
import { Use_them } from "../hooks/ThemProvider";
import { useRouter } from "@/app/navigation";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

const sizes = [
  { label: "38", available: true },
  { label: "39", available: true },
  { label: "40", available: true },
  { label: "41", available: true },
  { label: "42", available: true },
  { label: "43", available: false },
  { label: "44", available: true },
  { label: "45", available: false },
];

export default function Prodect_detail_component({ data }) {
  const toastT = useTranslations("toast");
  const [value, setValue] = useState(Math.round(data.rating));
  const [open, setOpen] = useState("none");
  const [selectedImage, setSelectedImage] = useState(0);
  const [image, setimage] = useState([]);
  const [info, setinfo] = useState({});
  const [wrong, setwrong] = useState({ color: "red", input: "" });
  const [wilaya, setwilaya] = useState("0");
  const [warning, setwarning] = useState({ messege: "", display: "none" });
  const [loding, setloding] = useState({ type: "", value: true });
  const [loading, setLoading] = useState(false);
  const { setmessge, setSeverity, setsnack, setCart } = Use_them();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(2);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [form, setform] = useState({
    size: "size3",
    color: data?.colors?.[0]?.color
      ? data.colors[0].color
      : data?.colors?.[0]?.color_name || "",
    quantity: 1,
  });
  function handle_order_form() {
    const order_form = [
      {
        order_info: form,
        prodect: data,
      },
    ];
    localStorage.removeItem("order_info");
    localStorage.setItem("order_info", JSON.stringify(order_form));
    router.push("/order_form");
  }
  const max_quantity =
    data?.colors?.find((color) =>
      color?.color
        ? color.color === form.color
        : color.color_name === form.color,
    )?.quantity ?? 1;
  const [delivery, setdelivery] = useState({
    items: [
      {
        product: data.id,
        quantity: form.quantity,
        color: form.color,
      },
    ],
    deliveries: [
      {
        delivery_address: {
          wilaya: "0",
          baldya: "0",
        },
        delivery_phone: [""],
        first_name: "",
        last_name: "",
      },
    ],
  });
  const handleClick = useCallback(
    (msg, sev) => {
      setmessge(msg);
      setSeverity(sev);
      setsnack(true);
    },
    [setmessge, setSeverity, setsnack],
  );

  const buildItemsPayload = () => [
    { product: data.id, quantity: form.quantity, color: form.color },
  ];
  const user_order = async () => {
    try {
      setloding({ type: "warning", value: true });
      setwarning({ ...warning, display: "flex" });
      const res = await apiFetch(`http://${URL}:8000/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: buildItemsPayload(),
          deliveries: [
            {
              delivery_address: {
                wilaya: info?.address_line?.wilaya || "0",
                baldya: info?.address_line?.baldya || "0",
              },
              delivery_phone: Array.isArray(info?.phone_numbers)
                ? info.phone_numbers
                : [],
              first_name: info?.first_name || "",
              last_name: info?.last_name || "",
            },
          ],
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setloding({ type: "", value: false });
        setwarning({
          messege: errorData.error
            ? errorData.error + " pless complet your order"
            : "pless complet all the importent field",
          display: "flex",
        });
        throw new Error(JSON.stringify(errorData));
      } else {
        setwarning({ ...warning, display: "none" });
      }
      handleClick(toastT("order_sent_success"), "success");
    } catch (error) {
      handleClick(toastT("order_send_failed"), "error");
    } finally {
      setloding({ type: "", value: false });
    }
  };
  const Anonimo_order = async () => {
    if (
      !delivery.deliveries[0].first_name ||
      delivery.deliveries[0].first_name.length < 3
    ) {
      setwrong({ ...wrong, input: "first_name" });
      handleClick(toastT("first_name_required_full"), "warning");
    } else if (
      !delivery.deliveries[0].last_name ||
      delivery.deliveries[0].last_name.length < 3
    ) {
      setwrong({ ...wrong, input: "last_name" });
      handleClick(toastT("last_name_required_full"), "warning");
    } else if (
      delivery.deliveries[0].delivery_address?.wilaya === "0" ||
      delivery.deliveries[0].delivery_address?.baldya === "0"
    ) {
      setwrong({ ...wrong, input: "wilaya" });
      handleClick(toastT("address_required"), "warning");
    } else if (
      !delivery.deliveries[0].delivery_phone[0] ||
      !/^(05|06|07|02)\d{8}$/.test(delivery.deliveries[0].delivery_phone[0])
    ) {
      setwrong({ ...wrong, input: "Phone1" });
      handleClick(toastT("primary_phone_invalid"), "warning");
    } else if (
      delivery.deliveries[0].delivery_phone[1] &&
      !/^(05|06|07|02)\d{8}$/.test(delivery.deliveries[0].delivery_phone[1])
    ) {
      setwrong({ ...wrong, input: "Phone2" });
      handleClick(toastT("secondary_phone_invalid"), "warning");
    } else {
      setwrong({ ...wrong, input: "" });
      let result = true;
      try {
        setloding({ type: "warning", value: true });
        setwarning({ ...warning, display: "flex" });
        const res = await apiFetch(`http://${URL}:8000/api/orders/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(delivery),
        });
        if (!res.ok) {
          const errorData = await res.json();
          setloding({ type: "", value: false });
          result = false;
          setwarning({
            messege: errorData.error
              ? errorData.error
              : "pless complet all the importent field",
            display: "flex",
          });
          throw new Error(JSON.stringify(errorData));
        }
        handleClick(toastT("order_sent_success"), "success");
      } catch (error) {
        handleClick(toastT("order_send_failed"), "error");
      } finally {
        setloding({ type: "", value: false });
        if (result) {
          setwarning({ ...warning, display: "none" });
        }
      }
    }
  };
  const hendel_add_car = () => {
    const newItem = {
      id: data.id,
      quantity: form.quantity,
      color: form.color,
    };
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let item = JSON.parse(localStorage.getItem("cart"));
    let check = item?.find((i) => i.id == data.id && i.color == form.color);
    if (check) {
      handleClick(toastT("item_already_in_cart"), "warning");
    } else {
      localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
      setCart((prev) => [...prev, newItem]);
      item = JSON.parse(localStorage.getItem("cart"));
      let find = item.find((i) => i.id == data.id && i.color == form.color);
      if (find) {
        handleClick(toastT("item_added_to_cart"), "success");
      } else {
        handleClick(toastT("order_send_failed"), "error");
      }
    }
  };
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setloding({ type: "prodect", value: true });
        const account = await Account();
        setinfo(account.user);
      } catch (error) {
      } finally {
        setloding({ type: "", value: false });
      }
    };
    fetchAccount();
  }, []);
  useEffect(() => {
    document.documentElement.style.setProperty("--display_order", open);
    document.documentElement.style.setProperty(
      "--display_order_animation",
      open === "flex" ? "opacity_2" : null,
    );
  }, [open]);

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
  const hendel_add_btn = () => {
    if (
      form.quantity >=
      data?.colors.find((color) =>
        color.color
          ? color.color === form.color
          : color.color_name === form.color,
      ).quantity
    ) {
      setform({ ...form, quantity: form.quantity });
      handleClick(toastT("quantity_unavailable"), "warning");
    } else {
      setform({ ...form, quantity: form.quantity + 1 });
    }
  };
  const hendel_minus_btn = () => {
    if (form.quantity <= 1) {
      setform({ ...form, quantity: form.quantity });
      handleClick(toastT("quantity_invalid"), "warning");
    } else {
      setform({ ...form, quantity: form.quantity - 1 });
    }
  };
  useEffect(() => {
    let img = [data.primary_image];
    (data.secondary_images || []).forEach((im) => img.push(im.image));
    setimage(img);
  }, [data.primary_image, data.secondary_images]);
  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? image.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === image.length - 1 ? 0 : prev + 1));
  };
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

    if (Math.abs(diffX) > 10) {
      e.preventDefault();
    }

    setDragOffset(diffX);
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isDragging.current) return;
      e.currentTarget.releasePointerCapture(e.pointerId);
      isDragging.current = false;
      const diff = touchEndX.current - touchStartX.current;
      const threshold = 50; // minimum swipe distance

      setDragOffset(0);

      if (Math.abs(diff) > threshold) {
        if (diff < 0) {
          handleNextImage();
        } else {
          handlePrevImage();
        }
      }
    },
    [handleNextImage, handlePrevImage],
  );
  return (
    <>
      <main>
        <div className="pro-detail">
          <div className="product-main animate-in">
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
                  {image.map((img, index) => (
                    <div className="gallery-slide" key={index}>
                      <img
                        src={img}
                        alt="image"
                        className={`gallery-slide-img ${img ? "loaded" : ""}`}
                        loading={index <= 1 ? "eager" : "lazy"}
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
                <div className="gallery-dots">
                  {image.map((_, index) => (
                    <button
                      key={index}
                      className={`gallery-dot ${selectedImage === index ? "active" : ""}`}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`صورة ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="gallery-badges">
                  <span className="badge badge-sale">خصم 30%</span>
                  <span className="badge badge-new">جديد</span>
                </div>
                <button
                  className="gallery-arrow gallery-arrow-right"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    handleNextImage();
                  }}
                >
                  <ChevronRightIcon />
                </button>
                <button
                  className="gallery-arrow gallery-arrow-left"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    handlePrevImage();
                  }}
                >
                  <ChevronLeftIcon />
                </button>
                <div className="gallery-counter">
                  {selectedImage + 1} / {image.length}
                </div>
              </div>
              <div className="gallery-thumbs-wrapper">
                <button
                  className={`scroll-arrow-thumbs scroll-arrow-right ${!canScrollLeft ? "hidden" : ""}`}
                  onClick={() => scroll("left")}
                  aria-label="تمرير للأمام"
                >
                  <ChevronRightIcon />
                </button>
                <div className="gallery-thumbs" ref={scrollRef}>
                  {image.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      className={`gallery-thumb ${image[selectedImage] === img ? "active" : ""}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={img} alt="Product Image" />
                    </button>
                  ))}
                </div>
                <button
                  className={`scroll-arrow-thumbs scroll-arrow-left ${!canScrollRight ? "hidden" : ""}`}
                  onClick={() => scroll("right")}
                  aria-label="تمرير للخلف"
                >
                  <ChevronLeftIcon />
                </button>
              </div>
            </div>

            <div className="product-info">
              <span className="product-category">أحذية رياضية / جري</span>
              <h1 className="product-title">{data.name}</h1>

              <div className="product-rating">
                <span className="rating-text">
                  <strong>{data.rating}</strong> من 5
                </span>
                <span className="divider">|</span>
                <span className="rating-text">{data.reviews_count} تقييم</span>
                <span className="divider">|</span>
                <span className="rating-text" style={{ color: "#10b981" }}>
                  1,250+ مبيعة
                </span>
              </div>
              <Box sx={{ "& > legend": { mt: 0 } }}>
                <Rating
                  name="simple-controlled"
                  value={value}
                  dir="ltr"
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Box>
              <div className="product-price-section">
                <span className="current-price">{data.price}$</span>
                <span className="original-price">659 ر.س</span>
                <span className="discount-percent">وفّر 200 ر.س</span>
              </div>

              <p className="product-description">{data.description}</p>

              <div className="option-group">
                <div className="option-label">
                  اللون: <span>{form.color}</span>
                </div>
                <div className="color-options">
                  {data.colors.map((color, index) => {
                    if (color.color) {
                      return (
                        <button
                          key={color.color}
                          className={`color-swatch ${form.color === color.color ? "active" : ""}`}
                          style={{ backgroundColor: color.color }}
                          onClick={() =>
                            setform({
                              ...form,
                              color: color.color,
                              quantity: 1,
                            })
                          }
                          title={color.color}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              <div className="option-group">
                <div className="option-label">
                  المقاس: <span>{sizes[selectedSize].label} EU</span>
                </div>
                <div className="size-options">
                  {sizes.map((size, index) => (
                    <button
                      key={size.label}
                      className={`size-btn ${selectedSize === index ? "active" : ""} ${!size.available ? "disabled" : ""}`}
                      onClick={() => size.available && setSelectedSize(index)}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="quantity-section">
                <div className="option-label" style={{ marginBottom: 0 }}>
                  الكمية:
                </div>
                <div className="quantity-control">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      setform({
                        ...form,
                        quantity: Math.max(1, form.quantity - 1),
                      })
                    }
                  >
                    −
                  </button>
                  <div className="qty-value">{form.quantity}</div>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      setform({
                        ...form,
                        quantity: Math.min(max_quantity, form.quantity + 1),
                      })
                    }
                  >
                    +
                  </button>
                </div>
                <div className="stock-info low">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  متبقي 5 قطع فقط!
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-car"
                  onClick={() => hendel_add_car()}
                >
                  <span className="material-symbols-outlined">
                    add_shopping_cart
                  </span>
                  أضف إلى السلة
                </button>
                <button
                  className="btn btn-buy"
                  onClick={() => {
                    handle_order_form();
                    setLoading(true);
                  }}
                >
                  {loading ? (
                    <>
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
                    </>
                  ) : (
                    " شراء الأن"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="test" style={{ display: open }}>
        <div className="Order_detail">
          <div className="Product_detail">
            <div className="Title">
              <h1>Product Detail</h1>
            </div>
            <div className="content">
              <img src={data.primary_image} alt="Product Image" />
              <div className="detail">
                <h1>{data.name}</h1>
                <label>
                  Color : <span>{form.color}</span>
                </label>
                <label>
                  Size : <span>{form.size}</span>
                </label>
                <label>
                  Quantity : <span>{form.quantity}</span>
                </label>
                <label>
                  Price : <span>{data.price} $</span>
                </label>
              </div>
            </div>
            <div className="Title">
              <h1>Delivery information</h1>
            </div>
            {info.username === "@Anonimo" ? (
              <>
                <div className="detail_delivery">
                  <form className="delivery">
                    <div className="Ferst_Name_order">
                      <label>Ferst Name :</label>
                      <input
                        type="text"
                        value={
                          delivery.deliveries &&
                          delivery.deliveries[0]?.first_name
                            ? delivery.deliveries[0].first_name
                            : ""
                        }
                        onChange={(e) => {
                          const newDeliveries = delivery.deliveries
                            ? [...delivery.deliveries]
                            : [{}];
                          newDeliveries[0] = {
                            ...newDeliveries[0],
                            first_name: e.target.value,
                          };
                          setdelivery({
                            ...delivery,
                            deliveries: newDeliveries,
                          });
                        }}
                        style={{
                          borderColor:
                            wrong.input === "first_name"
                              ? wrong.color
                              : "black",
                        }}
                        required
                      />
                    </div>
                    <div className="Last_Name_order">
                      <label>Last Name :</label>
                      <input
                        type="text"
                        value={
                          delivery.deliveries &&
                          delivery.deliveries[0]?.last_name
                            ? delivery.deliveries[0].last_name
                            : ""
                        }
                        onChange={(e) => {
                          const newDeliveries = delivery.deliveries
                            ? [...delivery.deliveries]
                            : [{}];
                          newDeliveries[0] = {
                            ...newDeliveries[0],
                            last_name: e.target.value,
                          };
                          setdelivery({
                            ...delivery,
                            deliveries: newDeliveries,
                          });
                        }}
                        style={{
                          borderColor:
                            wrong.input === "last_name" ? wrong.color : "black",
                        }}
                        required
                      />
                    </div>
                    <div className="wilaya_order" required>
                      <label>Wilaya :</label>
                      <select
                        value={wilaya}
                        onChange={(e) => {
                          setwilaya(e.target.value);
                          const newDeliveries = delivery.deliveries
                            ? [...delivery.deliveries]
                            : [{}];
                          newDeliveries[0] = {
                            ...newDeliveries[0],
                            delivery_address: {
                              ...((newDeliveries[0] &&
                                newDeliveries[0].delivery_address) ||
                                {}),
                              wilaya: e.target.value,
                            },
                          };
                          setdelivery({
                            ...delivery,
                            deliveries: newDeliveries,
                          });
                        }}
                        style={{
                          borderColor:
                            wrong.input === "wilaya" ? wrong.color : "black",
                        }}
                      >
                        <option value="0">-- اختر الولاية --</option>
                        {WILAYAS_DATA.map((w) => (
                          <option key={w.wilaya_code} value={w.wilaya_name}>
                            {w.wilaya_code} - {w.wilaya_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="wilaya_order" required>
                      <label>Baldya :</label>
                      <select
                        value={
                          (delivery.deliveries &&
                            delivery.deliveries[0]?.delivery_address?.baldya) ||
                          ""
                        }
                        disabled={wilaya === "0"}
                        onChange={(e) => {
                          const newDeliveries = delivery.deliveries
                            ? [...delivery.deliveries]
                            : [{}];
                          newDeliveries[0] = {
                            ...newDeliveries[0],
                            delivery_address: {
                              ...((newDeliveries[0] &&
                                newDeliveries[0].delivery_address) ||
                                {}),
                              baldya: e.target.value,
                            },
                          };
                          setdelivery({
                            ...delivery,
                            deliveries: newDeliveries,
                          });
                        }}
                        style={{
                          borderColor:
                            wrong.input === "wilaya" ? wrong.color : "black",
                        }}
                      >
                        <option value="فارغ">-- اختر البلدية --</option>
                        {wilaya !== "0" &&
                          WILAYAS_DATA.find(
                            (w) => w.wilaya_name === wilaya,
                          )?.communes?.map((commune, idx) => (
                            <option key={idx} value={commune.commune_name}>
                              {commune.commune_name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="Phone" required>
                      <label>Phone 1:</label>
                      <input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        style={{
                          appearance: "textfield",
                          borderColor:
                            wrong.input === "Phone1" ? wrong.color : "black",
                        }}
                        value={
                          delivery.deliveries &&
                          delivery.deliveries[0]?.delivery_phone &&
                          Array.isArray(
                            delivery.deliveries[0].delivery_phone,
                          ) &&
                          delivery.deliveries[0].delivery_phone[0]
                            ? delivery.deliveries[0].delivery_phone[0]
                            : ""
                        }
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                        }}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          const newDeliveries = delivery.deliveries
                            ? [...delivery.deliveries]
                            : [{}];
                          const phones =
                            newDeliveries[0]?.delivery_phone &&
                            Array.isArray(newDeliveries[0].delivery_phone)
                              ? [...newDeliveries[0].delivery_phone]
                              : ["", ""];
                          phones[0] = val;
                          newDeliveries[0] = {
                            ...newDeliveries[0],
                            delivery_phone: phones,
                          };
                          setdelivery({
                            ...delivery,
                            deliveries: newDeliveries,
                          });
                        }}
                        maxLength={10}
                        required
                      />
                    </div>
                    <div className="Phone">
                      <label>Phone 2:</label>
                      <input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        style={{
                          appearance: "textfield",
                          borderColor:
                            wrong.input === "Phone2" ? wrong.color : "black",
                        }}
                        value={
                          delivery.deliveries &&
                          delivery.deliveries[0]?.delivery_phone &&
                          Array.isArray(
                            delivery.deliveries[0].delivery_phone,
                          ) &&
                          delivery.deliveries[0].delivery_phone[1]
                            ? delivery.deliveries[0].delivery_phone[1]
                            : ""
                        }
                        onInput={(e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                        }}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          const newDeliveries = delivery.deliveries
                            ? [...delivery.deliveries]
                            : [{}];
                          const phones =
                            newDeliveries[0]?.delivery_phone &&
                            Array.isArray(newDeliveries[0].delivery_phone)
                              ? [...newDeliveries[0].delivery_phone]
                              : ["", ""];
                          phones[1] = val;
                          newDeliveries[0] = {
                            ...newDeliveries[0],
                            delivery_phone: phones,
                          };
                          setdelivery({
                            ...delivery,
                            deliveries: newDeliveries,
                          });
                        }}
                        maxLength={10}
                      />
                    </div>
                    <div className="Confirmation">
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          Anonimo_order();
                        }}
                        className="Confirm"
                      >
                        Confirm
                      </button>
                      <button
                        className="Cancel"
                        onClick={() => setOpen("none")}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="detail">
                  <p>{info.first_name + " " + info.last_name}</p>
                  <label className="Phone">
                    Phone :{" "}
                    <span>
                      {Array.isArray(info.phone_numbers) &&
                      info.phone_numbers.length > 0
                        ? info.phone_numbers.filter(Boolean).join(" / ")
                        : "/"}
                    </span>
                  </label>
                  <label className="Addres">
                    Addres :{" "}
                    <span>
                      {info.address_line && info.address_line.wilaya
                        ? info.address_line.wilaya +
                          "/" +
                          info.address_line.baldya
                        : "/"}
                    </span>
                  </label>
                  <label>
                    payment: <span>On Delivery</span>
                  </label>
                </div>
                <div className="Confirmation">
                  <button
                    className="Confirm"
                    onClick={() => {
                      user_order();
                    }}
                  >
                    Confirm
                  </button>
                  <button className="Cancel" onClick={() => setOpen("none")}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="warning_contener" style={{ display: warning.display }}>
          <div className="warning">
            {loding.type === "warning" && loding.value ? (
              <div className="loading_contener" style={{ height: "50px" }}>
                <div className="loader"></div>
              </div>
            ) : (
              <>
                <h1>{warning.messege}</h1>
                <div className="btn">
                  <button
                    onClick={() => setwarning({ status: "", display: "None" })}
                  >
                    Try again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
