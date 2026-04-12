"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  startTransition,
} from "react";
import { useRouter, Link, usePathname } from "@/app/navigation";
import { useParams } from "next/navigation";
import {
  useDeviceDimensions,
  useViewportSize,
} from "../hooks/useDeviceDimensions";
import {
  calculateOptimalDimensions,
  calculateOptimalGridColumns,
  getPerformanceSettings,
} from "../utils/deviceUtils";
import { URL } from "../data/URL.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Account, apiFetch } from "../data/FETCH.js";
import { Use_them } from "../hooks/ThemProvider";
import { Field } from "./order_form.jsx";
import { wilayas } from "../data/Wilaya.js";
import {
  TranslateIcon,
  LocationIcon,
  PhoneIcon,
  PersonIcon,
  HomeIcon,
  ShoppingCartIcon,
  MenuIcon,
  PasswordIcon,
  PasswordCheckIcon,
  EmailIcon,
  PasswordStarsIcon,
  ArrowRightIcon,
  ZapIcon,
  ShieldIcon,
  TruckIcon,
} from "../data/Icons.jsx";
import { useTranslations } from "next-intl";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { locales } from "../config";

// ─── ثوابت خارج المكوّنات ────────────────────────────────────────
const ANON_CREDENTIALS = { username: "@Anonimo", password: "@A.123456" };

// ─── Spinner مشترك ───────────────────────────────────────────────
function Spinner({ color = "white" }) {
  return (
    <svg className="spin" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
        style={{ opacity: 0.25 }}
      />
      <path
        fill={color}
        style={{ opacity: 0.75 }}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── SnackbarAlert ───────────────────────────────────────────────
const SnackbarAlert = React.forwardRef(function SnackbarAlert(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ─── حساب عدد عناصر السلة ────────────────────────────────────────
function getCartCount(cart) {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0);
}

// ─── الصفحة الرئيسية ─────────────────────────────────────────────
export default function Home_component({ data }) {
  return (
    <main>
      <div className="prodect-container">
        <Hero />
        <Features />
        <Pro prodect={data} />
      </div>
    </main>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────
function Navbar({ setvalue }) {
  const t = useTranslations("navbar");
  const toastT = useTranslations("toast");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { setmessge, setSeverity, setsnack, cart } = Use_them();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [loged, setLoged] = useState({ isLoggedIn: false, isUser: false });
  const [account, setAccount] = useState(null);
  const navRef = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick_tra = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = useCallback(
    (msg, sev) => {
      setmessge(msg);
      setSeverity(sev);
      setsnack(true);
    },
    [setmessge, setSeverity, setsnack],
  );
  const handleChangeLocale = (locale) => {
    startTransition(() => {
      router.replace({ pathname, params }, { locale });
    });

    handleClose();
  };
  // ─── تسجيل الخروج ─────────────────────────────────────────────
  const logout = async () => {
    try {
      const res = await apiFetch(`http://${URL}:8000/api/logout/`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();

      // إعادة تعيين الحساب الافتراضي
      await fetch(`http://${URL}:8000/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ANON_CREDENTIALS),
        credentials: "include",
      });

      handleClick(toastT("logout_success"), "success");
      setTimeout(() => location.reload(), 500);
    } catch {
      handleClick(toastT("logout_failed"), "error");
    }
  };

  // ─── تحريك القائمة المحمول ────────────────────────────────────
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    if (!mobileMenuOpen) {
      el.style.display = "flex";
      el.style.height = el.scrollHeight + 65 + "px";
      el.style.padding = "20px";
      el.style.marginTop = "20px";
      el.style.gap = "15px";
    } else {
      el.style.height = "0px";
      el.style.padding = "0px";
      el.style.marginTop = "0px";
      el.style.gap = "0px";
      setTimeout(() => {
        el.style.display = "none";
      }, 300);
    }
  }, [mobileMenuOpen]);

  // ─── تحديث عداد السلة ─────────────────────────────────────────
  useEffect(() => {
    setCartCount(getCartCount(cart));
  }, [cart]);

  // ─── جلب بيانات الحساب ────────────────────────────────────────
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await Account();
        setLoged({
          isLoggedIn: res.user.username !== "@Anonimo",
          isUser: res.user.isuser,
        });
        setAccount(res);
      } catch (_) {}
    };
    fetchAccount();
  }, []);

  return (
    <div className="head">
      <div className="header-content">
        {/* الشعار */}
        <div className="logo-section">
          <div className="logo-box" />
          <span className="logo-text">LOGO</span>
        </div>

        {/* روابط التنقل */}
        <nav className="nav">
          <Link href="/">
            <span className="nav-link">{t("home")}</span>
          </Link>
          <Link href="/shop">
            <span className="nav-link">{t("products")}</span>
          </Link>
          <a href="#" className="nav-link">
            {t("about")}
          </a>
          <a href="#" className="nav-link">
            {t("contact")}
          </a>
        </nav>

        {/* الإجراءات */}
        <div className="header-actions">
          <Link href="/car">
            <div className="cart-icon">
              <ShoppingCartIcon />
              <span className={`cart-badge ${cartCount > 0 ? "active" : ""}`}>
                {cartCount}
              </span>
            </div>
          </Link>
          <div>
            <IconButton
              aria-label="more"
              onClick={handleClick_tra}
              style={{ padding: "0px" }}
            >
              <TranslateIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {locales.map((loc) => (
                <MenuItem key={loc} onClick={() => handleChangeLocale(loc)}>
                  {t(`${loc}`)}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {loged.isUser && loged.isLoggedIn ? (
            <>
              <img
                onClick={() => router.push("/orders")}
                src={account?.user?.image || "/default.jpg"}
                alt="profile"
                style={{ cursor: "pointer" }}
              />
              <a
                onClick={logout}
                className="log-out-btn"
                style={{ cursor: "pointer" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                {t("logout")}
              </a>
            </>
          ) : (
            <a
              onClick={() => setvalue("flex")}
              className="sign-in-btn"
              style={{ cursor: "pointer" }}
            >
              {t("login")}
            </a>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((p) => !p)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* القائمة المحمول */}
      <nav className="mobile-nave" ref={navRef} style={{ display: "none" }}>
        <Link href="/">
          <span className="nav-link">{t("home")}</span>
        </Link>
        <Link href="/shop">
          <span className="nav-link">{t("products")}</span>
        </Link>
        <a href="#" className="nav-link">
          {t("about")}
        </a>
        {loged.isUser && loged.isLoggedIn && (
          <>
            <a
              onClick={logout}
              className="log-out-btn-mobile"
              style={{ cursor: "pointer" }}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              {t("logout")}
            </a>
          </>
        )}
      </nav>
    </div>
  );
}

// ─── بطاقة المنتج ────────────────────────────────────────────────
const Product_Card = ({
  id,
  title,
  subtitle,
  price,
  image,
  colors,
  sizes,
  inStock = true,
}) => (
  <Link href={`/prodect_detail/${id}`}>
    <div className="product-card">
      <div className="card-image-wrapper">
        <img src={image} alt={title} className="card-image" />
        {inStock && <span className="badge">in stock</span>}
      </div>
      <div className="card-content">
        <h3 className="product-title">{title}</h3>
        {subtitle && <p className="product-subtitle">{subtitle}</p>}
        <p className="product-price">{price} DZ</p>

        <div className="options-container">
          <div className="color-options">
            {colors.map((color, i) =>
              color.color ? (
                <span
                  key={i}
                  className="color-dot"
                  style={{ backgroundColor: color.color }}
                  title={color.color}
                />
              ) : null,
            )}
          </div>
          {Array.isArray(sizes) && (
            <div className="size-options">
              {sizes.map((size, i) => (
                <span key={i} className="size-option">
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        <button className="add-to-cart-btn" aria-label="Add to cart">
          <span className="material-symbols-outlined">add_shopping_cart</span>
        </button>
      </div>
    </div>
  </Link>
);

// ─── قسم المنتجات ────────────────────────────────────────────────
const Pro = ({ prodect }) => {
  const t = useTranslations("pro");
  return (
    <section className="pro">
      <div className="products-header">
        <div className="products-title-section">
          <h2>{t("title")}</h2>
          <p>{t("subtitle")}</p>
        </div>
        <Link href="/shop">
          <span className="view-all-btn">
            {t("view_all")} <ArrowRightIcon />
          </span>
        </Link>
      </div>
      <div className="products-grid">
        {prodect.slice(0, 4).map((item) => (
          <Product_Card
            key={item.id}
            id={item.id}
            title={item.name}
            subtitle={item.subtitle}
            price={item.price}
            image={item.primary_image}
            colors={item.colors}
            sizes={item.sizes}
          />
        ))}
      </div>
    </section>
  );
};

// ─── محتوى الفوتر ────────────────────────────────────────────────
function Footer_content() {
  const t = useTranslations("footer");
  return (
    <div className="footer">
      <h3 className="footer-title">{t("title")}</h3>
      <div className="footer-content">
        <div className="footer-item">
          <span className="footer-label">{t("email_label")}</span>
          <span>Gmail_Gmail@support.com</span>
        </div>
        <div className="footer-item">
          <span className="footer-label">{t("mobile_label")}</span>
          <span>0666666666 / 07777777777 / 0555555555 / 02222222222</span>
        </div>
        <div className="footer-item">
          <span className="footer-label">{t("social_label")}</span>
          <div className="footer-social">
            <a href="#">Facebook.com</a>
            <a href="#">Instagram.com</a>
            <a href="#">Telegram.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── مكوّن تسجيل الدخول / التسجيل ───────────────────────────────
const Login = ({ setvalue, value, token }) => {
  const t = useTranslations("login");
  const toastT = useTranslations("toast");
  const { setmessge, setSeverity, setsnack } = Use_them();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wilaya: "",
    commune: "",
    email: "",
    phone1: "",
    phone2: "",
    password: "",
    confirmPassword: "",
    code: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeForm, setActiveForm] = useState("signin"); // "signin" | "signup"
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStep, setPasswordStep] = useState("send"); // "send" | "verify"

  const selectedWilaya = wilayas.find(
    (w) => w.name.toString() === formData.wilaya,
  );
  const communes = selectedWilaya?.communes ?? [];

  const handleClick = useCallback(
    (msg, sev) => {
      setmessge(msg);
      setSeverity(sev);
      setsnack(true);
    },
    [setmessge, setSeverity, setsnack],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      name === "wilaya"
        ? { ...prev, wilaya: value, commune: "" }
        : { ...prev, [name]: value },
    );
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ─── CSS Variables للتبديل بين الفورمين ──────────────────────
  useEffect(() => {
    const isSignIn = activeForm === "signin";
    document.documentElement.style.setProperty(
      "--in",
      isSignIn ? "opacity_2" : "opacity_1",
    );
    document.documentElement.style.setProperty(
      "--up",
      !isSignIn ? "opacity_2" : "opacity_1",
    );
    document.documentElement.style.setProperty("--login", "opacity_2");
    document.documentElement.style.setProperty(
      "--in_display",
      isSignIn ? "flex" : "none",
    );
    document.documentElement.style.setProperty(
      "--up_display",
      !isSignIn ? "grid" : "none",
    );
  }, [activeForm]);

  // ─── تعيين الحساب الافتراضي إن لم يكن هناك token ────────────
  useEffect(() => {
    if (!token) {
      localStorage.setItem("logeed", "false");
      fetch(`http://${URL}:8000/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ANON_CREDENTIALS),
        credentials: "include",
      });
    }
  }, []);

  // ─── تسجيل الدخول ─────────────────────────────────────────────
  const validateSignIn = async () => {
    const newErrors = {};
    const { password, email } = formData;

    if (!email) newErrors.email = t("errors.email_required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase()))
      newErrors.email = t("errors.email_invalid");
    if (!password) newErrors.password = t("errors.password_required");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    try {
      const res = await fetch(`http://${URL}:8000/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrors({
          validate: t("errors.credentials_invalid"),
          email: errorData.email,
          password: errorData.password,
        });
        handleClick(toastT("login_failed"), "error");
        return false;
      }
      handleClick(toastT("login_success"), "success");
      setTimeout(() => location.reload(), 1000);
      return true;
    } catch {
      handleClick(toastT("login_failed"), "error");
      return false;
    }
  };

  // ─── إنشاء حساب ───────────────────────────────────────────────
  const validateSignUp = async () => {
    const newErrors = {};
    const phoneRegex = /^0[5-7][0-9]{8}$/;
    const {
      password,
      confirmPassword,
      firstName,
      lastName,
      wilaya,
      commune,
      email,
      phone1,
      phone2,
    } = formData;

    if (!firstName.trim())
      newErrors.firstName = t("errors.first_name_required");
    else if (firstName.trim().length < 2)
      newErrors.firstName = t("errors.first_name_min_length");

    if (!lastName.trim()) newErrors.lastName = t("errors.last_name_required");
    else if (lastName.trim().length < 2)
      newErrors.lastName = t("errors.last_name_min_length");

    if (!email) newErrors.email = t("errors.email_required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase()))
      newErrors.email = t("errors.email_invalid");

    if (!wilaya) newErrors.wilaya = t("errors.wilaya_required");
    if (!commune) newErrors.commune = t("errors.commune_required");

    if (!phone1.trim()) newErrors.phone1 = t("errors.phone1_required");
    else if (!phoneRegex.test(phone1))
      newErrors.phone1 = t("errors.phone_invalid");

    if (phone2.trim() && !phoneRegex.test(phone2))
      newErrors.phone2 = t("errors.phone_invalid");
    if (phone1 && phone2 && phone1 === phone2)
      newErrors.phone2 = t("errors.phone2_same_as_phone1");

    if (!password) newErrors.password = t("errors.password_required");
    else if (password.length < 6)
      newErrors.password = t("errors.password_min_length");

    if (!confirmPassword)
      newErrors.confirmPassword = t("errors.confirm_password_required");
    else if (password !== confirmPassword)
      newErrors.confirmPassword = t("errors.confirm_password_mismatch");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    try {
      const res = await fetch(`http://${URL}:8000/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_numbers: phone2 ? [phone1, phone2] : [phone1],
          password: confirmPassword,
          username: email,
          address_line: { wilaya, baldya: commune },
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrors({
          validate: errorData.error || t("errors.register_failed"),
          firstName: errorData.firstName || "",
          lastName: errorData.lastName || "",
          phone1: errorData.phone1 || "",
          phone2: errorData.phone2 || "",
          email: errorData.username || "",
          wilaya: errorData.wilaya || "",
          commune: errorData.commune || "",
        });
        handleClick(toastT("order_send_failed"), "error");
        return false;
      }
      handleClick(toastT("order_sent_success"), "success");
      // تسجيل الدخول تلقائياً بعد التسجيل
      await validateSignIn();
      return true;
    } catch {
      handleClick(toastT("order_send_failed"), "error");
      return false;
    }
  };

  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    await validateSignIn();
    setLoading(false);
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    await validateSignUp();
    setLoading(false);
  };

  // ─── إرسال كود إعادة تعيين كلمة المرور ──────────────────────
  const handleSendCode = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = t("errors.email_required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.toLowerCase()))
      newErrors.email = t("errors.email_invalid");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch(`http://${URL}:8000/api/Send_otp_Code/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.email }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrors({
          validate: errorData.error || t("errors.send_failed_retry"),
          email: errorData.email || "",
        });
        throw new Error();
      }
      handleClick(toastT("code_sent_success"), "success");
      setPasswordStep("verify");
    } catch {
      handleClick(toastT("send_failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  // ─── التحقق من الكود ──────────────────────────────────────────
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const { code, email } = formData;
    if (!code) {
      setErrors({ code: t("errors.code_required") });
      return;
    }

    setLoading(true);
    const body = new FormData();
    body.append("username", email);
    body.append("code", code);

    try {
      const res = await apiFetch(`http://${URL}:8000/api/VerifyOTPView/`, {
        method: "POST",
        body,
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrors({
          validate: errorData.error || t("errors.send_failed_retry"),
          code: errorData.code || "",
        });
        throw new Error();
      }
      handleClick(toastT("password_updated_success"), "success");
      setShowPasswordModal(false);
      setPasswordStep("send");
      setErrors({});
      setvalue("none");
      location.reload();
    } catch {
      handleClick(toastT("send_failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setvalue("none");
    setActiveForm("signin");
    setErrors({});
  };

  return (
    <>
      {/* ─── نافذة الدخول/التسجيل ─── */}
      <div className="login_contener" style={{ display: value }}>
        <div className="Form_contener">
          <div className="Btn_close">
            <button onClick={closeModal}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* فورم تسجيل الدخول */}
          <form className="Sign_in" onSubmit={handleSubmitSignIn}>
            <Field
              label={t("fields.email")}
              required
              error={errors.email}
              icon={<EmailIcon />}
            >
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("placeholders.email")}
                className={`form-input${errors.email ? " error" : ""}`}
              />
            </Field>

            <Field
              label={t("fields.password")}
              required
              error={errors.password}
              icon={<PasswordIcon />}
            >
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("placeholders.password")}
                className={`form-input${errors.password ? " error" : ""}`}
              />
              <p
                className="field-info"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPasswordModal(true)}
              >
                {t("buttons.forget_password")}
              </p>
            </Field>

            <Field error={errors.validate}>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <Spinner /> : t("buttons.submit_signin")}
              </button>
            </Field>
          </form>

          {/* فورم إنشاء الحساب */}
          <form className="Sign_up" onSubmit={handleSubmitSignUp}>
            <div className="form-grid-2">
              <Field
                label={t("fields.first_name")}
                required
                error={errors.firstName}
                icon={<PersonIcon />}
              >
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t("placeholders.first_name")}
                  className={`form-input${errors.firstName ? " error" : ""}`}
                />
              </Field>
              <Field
                label={t("fields.last_name")}
                required
                error={errors.lastName}
                icon={<PersonIcon />}
              >
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t("placeholders.last_name")}
                  className={`form-input${errors.lastName ? " error" : ""}`}
                />
              </Field>
            </div>

            <div className="password">
              <Field
                label={t("fields.password")}
                required
                error={errors.password}
                icon={<PasswordIcon />}
              >
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("placeholders.password")}
                  className={`form-input${errors.password ? " error" : ""}`}
                />
              </Field>
              <Field
                label={t("fields.confirm_password")}
                required
                error={errors.confirmPassword}
                icon={<PasswordCheckIcon />}
              >
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t("placeholders.confirm_password")}
                  className={`form-input${errors.confirmPassword ? " error" : ""}`}
                />
              </Field>
            </div>

            <div className="Wilaya">
              <Field
                label={t("fields.wilaya")}
                required
                error={errors.wilaya}
                icon={<LocationIcon />}
              >
                <select
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleChange}
                  className={`form-select${errors.wilaya ? " error" : ""}`}
                >
                  <option value="">{t("placeholders.select_wilaya")}</option>
                  {wilayas.map((w) => (
                    <option key={w.code} value={w.name.toString()}>
                      {w.code.toString().padStart(2, "0")} - {w.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label={t("fields.commune")}
                required
                error={errors.commune}
                icon={<HomeIcon />}
              >
                <select
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  disabled={!formData.wilaya}
                  className={`form-select${errors.commune ? " error" : ""}`}
                >
                  <option value="">
                    {formData.wilaya
                      ? t("placeholders.select_commune")
                      : t("placeholders.select_wilaya_first")}
                  </option>
                  {communes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="section-divider">
              <div className="section-divider-line" />
              <span className="section-divider-text">
                {t("labels.contact_info")}
              </span>
              <div className="section-divider-line" />
            </div>

            <Field
              label={t("fields.email")}
              required
              error={errors.email}
              icon={<EmailIcon />}
            >
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("placeholders.email")}
                className={`form-input${errors.email ? " error" : ""}`}
              />
            </Field>

            <div className="phone">
              <Field
                label={t("fields.phone1")}
                required
                error={errors.phone1}
                icon={<PhoneIcon />}
              >
                <input
                  type="tel"
                  name="phone1"
                  value={formData.phone1}
                  onChange={handleChange}
                  placeholder={t("placeholders.phone1")}
                  maxLength={10}
                  className={`form-input phone-input${errors.phone1 ? " error" : ""}`}
                />
              </Field>
              <Field
                label={t("fields.phone2")}
                error={errors.phone2}
                hint={t("hints.phone2_optional")}
                icon={<PhoneIcon />}
              >
                <input
                  type="tel"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleChange}
                  placeholder={t("placeholders.phone2")}
                  maxLength={10}
                  className={`form-input phone-input${errors.phone2 ? " error" : ""}`}
                />
              </Field>
            </div>

            <Field error={errors.validate}>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <Spinner /> : t("buttons.submit_signup")}
              </button>
            </Field>
          </form>

          {/* الجزء السفلي */}
          <div className="bottom">
            <p className="or">{t("labels.or")}</p>
            <div className="Accont">
              <button type="button">
                <img
                  src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_1x_rtl_r5.png"
                  alt="Gmail"
                />
              </button>
            </div>
            <p className="method">
              {activeForm === "signin" ? (
                <>
                  {t("labels.no_account")}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveForm("signup");
                    }}
                    style={{ cursor: "pointer", marginLeft: "5px" }}
                  >
                    {t("labels.sign_up")}
                  </a>
                </>
              ) : (
                <>
                  {t("labels.have_account")}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveForm("signin");
                    }}
                    style={{ cursor: "pointer", marginLeft: "5px" }}
                  >
                    {t("labels.sign_in")}
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ─── نافذة إعادة تعيين كلمة المرور ─── */}
      {showPasswordModal && (
        <div className="fixed-body" style={{ display: "flex" }}>
          <form
            className="code-body"
            onSubmit={
              passwordStep === "send" ? handleSendCode : handleVerifyCode
            }
            noValidate
          >
            <h3>
              {passwordStep === "verify"
                ? t("change_password.title_sent")
                : t("change_password.title_send")}
            </h3>

            <div className="inputs">
              <Field
                label={t("fields.email")}
                error={errors.email}
                icon={<EmailIcon />}
              >
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("placeholders.email")}
                  className={`form-input${errors.email ? " error" : ""}`}
                  disabled={passwordStep === "verify"}
                />
              </Field>

              {passwordStep === "verify" && (
                <Field
                  label={t("fields.code")}
                  error={errors.code}
                  icon={<PasswordStarsIcon />}
                  required
                >
                  <input
                    type="tel"
                    name="code"
                    onChange={handleChange}
                    maxLength={6}
                    className={`form-input phone-input${errors.code ? " error" : ""}`}
                  />
                </Field>
              )}
            </div>

            <Field error={errors.validate}>
              <div className="btn">
                <button
                  type="button"
                  className="btn-submit cancel"
                  disabled={loading}
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordStep("send");
                    setErrors({});
                  }}
                >
                  {t("buttons.cancel")}
                </button>
                <button
                  type="submit"
                  className="btn-submit save"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : t("buttons.send")}
                </button>
              </div>
            </Field>
          </form>
        </div>
      )}
    </>
  );
};

// ─── Header ──────────────────────────────────────────────────────
export const Header = ({ token_access }) => {
  const [value, setValue] = useState("none");
  return (
    <>
      <Navbar setvalue={setValue} />
      <Login setvalue={setValue} value={value} token={token_access} />
    </>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────
export const Hero = () => {
  const t = useTranslations("Hero");
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          {t("title.line1")}
          <br />
          {t("title.line2")}
        </h1>
        <p className="hero-subtitle">{t("subtitle")}</p>
        <div className="hero-buttons">
          <Link href="/shop">
            <button className="btn-primary">{t("buttons.shop")}</button>
          </Link>
          <button className="btn-secondary">{t("buttons.learn")}</button>
        </div>
      </div>
    </section>
  );
};

// ─── Features ────────────────────────────────────────────────────
export const Features = () => {
  const t = useTranslations("features");
  const cards = [
    { icon: <ZapIcon />, key: "fast_delivery" },
    { icon: <ShieldIcon />, key: "secure_shopping" },
    { icon: <TruckIcon />, key: "quality_guarantee" },
  ];
  return (
    <section className="why-choose">
      <h2 className="section-title">{t("title")}</h2>
      <p className="section-subtitle">{t("subtitle")}</p>
      <div className="features-grid">
        {cards.map(({ icon, key }) => (
          <div key={key} className="feature-card">
            <div className="feature-icon">{icon}</div>
            <h3 className="feature-title">{t(`cards.${key}.title`)}</h3>
            <p className="feature-description">
              {t(`cards.${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Footer ──────────────────────────────────────────────────────
export const Footer = () => <Footer_content />;

// ─── Settings (dev only) ─────────────────────────────────────────
export const Settings = () => {
  const deviceDimensions = useDeviceDimensions();
  const viewportSize = useViewportSize();

  if (process.env.NODE_ENV !== "development" || viewportSize.width === 0)
    return null;

  const optimalDimensions = calculateOptimalDimensions(deviceDimensions);
  const gridColumns = calculateOptimalGridColumns(
    viewportSize.width - optimalDimensions.sidebarWidth,
    optimalDimensions.cardMinWidth,
    optimalDimensions.cardMaxWidth,
  );
  const performanceSettings = getPerformanceSettings(deviceDimensions);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: 10,
        borderRadius: 5,
        fontSize: 12,
        zIndex: 1000,
      }}
    >
      <div>Width: {viewportSize.width}px</div>
      <div>Height: {viewportSize.height}px</div>
      <div>
        Device:{" "}
        {deviceDimensions.isMobile
          ? "Mobile"
          : deviceDimensions.isTablet
            ? "Tablet"
            : "Desktop"}
      </div>
      <div>Orientation: {deviceDimensions.orientation}</div>
      <div>Pixel Ratio: {deviceDimensions.devicePixelRatio}</div>
      <div>Grid Columns: {gridColumns}</div>
      <div>Sidebar: {Math.round(optimalDimensions.sidebarWidth)}px</div>
      <div>Card Min: {Math.round(optimalDimensions.cardMinWidth)}px</div>
      <div>Performance: {performanceSettings.imageQuality}</div>
    </div>
  );
};

// ─── Snackbar ────────────────────────────────────────────────────
export const Snack_bar = () => {
  const { message, severity, snack, setsnack } = Use_them();
  const handleClose = useCallback(
    (_, reason) => {
      if (reason === "clickaway") return;
      setsnack(false);
    },
    [setsnack],
  );

  return (
    <Snackbar open={snack} autoHideDuration={5000} onClose={handleClose}>
      <SnackbarAlert
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </SnackbarAlert>
    </Snackbar>
  );
};
