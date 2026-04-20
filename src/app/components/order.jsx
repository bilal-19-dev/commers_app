'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Account, apiFetch } from '../data/FETCH.js';
import { Field } from './order_form.jsx';
import { wilayas } from '../data/Wilaya.js';
import { URL } from '../data/URL.js';
import { Use_them } from '../hooks/ThemProvider.js';
import {
  LocationIcon,
  PhoneIcon,
  PersonIcon,
  HomeIcon,
  SearchIcon,
  PasswordCheckIcon,
  EmailIcon,
  EditIcon,
  PasswordIcon,
  PackageIcon,
  CheckIcon,
  ClockIcon,
  XIcon,
  PasswordStarsIcon,
} from '../data/Icons.jsx';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/app/navigation';

// ─── مكوّن بطاقة الطلب ───────────────────────────────────────────
const OrderCard = ({ order }) => {
  const t = useTranslations('orders');
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const toggleExpanded = () => {
    const el = contentRef.current;
    if (!el) return;
    el.style.height = isExpanded ? '0px' : el.scrollHeight + 'px';
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info-group">
          <div className="info-item">
            <span className="info-label">{t('order_card.order_id')}</span>
            <span className="info-value">#{order.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">{t('order_card.date_placed')}</span>
            <span className="info-value">
              {order.order_date.substring(0, 10)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">{t('order_card.item_count')}</span>
            <span className="info-value">{order.items_count}</span>
          </div>
        </div>

        <div className="order-header-actions">
          <div className={`order-status status-${order.status.toLowerCase()}`}>
            {order.status}
          </div>
          <button
            className={`btn-toggle ${isExpanded ? 'active' : ''}`}
            onClick={toggleExpanded}
            aria-expanded={isExpanded}
          >
            {isExpanded
              ? t('order_card.hide_products')
              : t('order_card.show_products')}
            <span className="toggle-icon">▼</span>
          </button>
        </div>
      </div>

      <div
        ref={contentRef}
        className="order-items fade-in"
        style={{
          height: 0,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div className="productsGrid">
          {order.items.map((item) => (
            <div key={`${item.id}-${item.color}`} className="productCard">
              <div className="productImageWrapper">
                <img
                  src={item.product.primary_image}
                  alt={item.product.name}
                  className="productImage"
                  loading="lazy"
                />
                <span className="productImageOverlay">×{item.quantity}</span>
              </div>
              <div className="productDetails">
                <h4 className="productName">{item.product.name}</h4>
                <p className="productVariant">
                  {t('order_card.color')}: {item.color} — {t('order_card.size')}
                  : {item.size || 'L'}
                </p>
                <div className="productPriceRow">
                  <span className="productPrice">${item.product.price}</span>
                  <span className="productQuantity">
                    {t('order_card.qty')}: {item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-footer">
        <span className="order-total-label">
          {t('order_card.order_total')}:
        </span>
        <span className="order-total-amount">${order.total_price}</span>
      </div>
    </div>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <div className={`stat-card stat-card-${color}`}>
    <div className="stat-header">
      <div className={`stat-icon stat-icon-${color}`}>{icon}</div>
    </div>
    <p className="stat-label">{label}</p>
    <p className="stat-value">{value}</p>
  </div>
);

// ─── SpinnerButton ────────────────────────────────────────────────
const SpinnerButton = ({
  loading,
  label,
  className,
  type = 'submit',
  onClick,
  disabled,
}) => (
  <button
    type={type}
    className={`btn-submit ${className}`}
    disabled={loading || disabled}
    onClick={onClick}
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
      label
    )}
  </button>
);

// ─── المكوّن الرئيسي ──────────────────────────────────────────────
export default function Order_component() {
  const t = useTranslations('orders');
  const locale = useLocale();
  const toastT = useTranslations('toast');
  const { setmessge, setSeverity, setsnack } = Use_them();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({});
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    image: '',
    firstName: '',
    lastName: '',
    wilaya: '',
    commune: '',
    phone1: '',
    phone2: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
  });
  const [errors, setErrors] = useState({});
  const [loding, setLoding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [passwordStep, setPasswordStep] = useState('send');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const passwordFormRef = useRef(null);

  const FILTERS = [
    { key: 'all', label: t('filters.all') },
    { key: 'delivered', label: t('filters.delivered') },
    { key: 'shipped', label: t('filters.shipped') },
    { key: 'pending', label: t('filters.pending') },
    { key: 'cancelled', label: t('filters.cancelled') },
  ];

  const activeWilaya = formData.wilaya || data.wilaya;
  const selectedWilaya = wilayas.find(
    (w) => w.name.toString() === activeWilaya
  );
  const communes = selectedWilaya?.communes ?? [];

  const handleClick = useCallback(
    (msg, sev) => {
      setmessge(msg);
      setSeverity(sev);
      setsnack(true);
    },
    [setmessge, setSeverity, setsnack]
  );

  const fetchOrders = useCallback(async () => {
    try {
      const res = await Account();
      if (res.user.username === '@Anonimo' || res.error_user) {
        router.push('/');
        return;
      }
      setOrders(Array.isArray(res?.orders) ? res.orders : []);
      setProfile(res.user);
      setData({
        image: res.user.image ?? null,
        firstName: res.user.first_name ?? '',
        lastName: res.user.last_name ?? '',
        wilaya: res.user?.address_line?.wilaya ?? '',
        commune: res.user?.address_line?.baldya ?? '',
        email: res.user.username ?? '',
        phone1: res.user.phone_numbers?.[0] ?? '',
        phone2: res.user.phone_numbers?.[1] ?? '',
        checked: res.user.checked ?? false,
      });
    } catch (_) {
      router.push('/');
    } finally {
      setLoding(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status?.toLowerCase() === 'delivered')
      .length,
    processing: orders.filter((o) => o.status?.toLowerCase() === 'pending')
      .length,
    cancelled: orders.filter((o) => o.status?.toLowerCase() === 'cancelled')
      .length,
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === 'all' || order.status.toLowerCase() === activeFilter;
    const matchesSearch =
      String(order.id).includes(searchQuery) ||
      (order.items || []).some((item) =>
        item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'wilaya') return { ...prev, wilaya: value, commune: '' };
      if (name === 'email') return { ...prev, email: value.toLowerCase() };
      return { ...prev, [name]: value };
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDeleteImage = async () => {
    if (formData.image) {
      setFormData((prev) => ({ ...prev, image: '' }));
      return;
    }
    try {
      const res = await apiFetch(`https://${URL}/api/account/me/`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setData((prev) => ({ ...prev, image: null }));
      handleClick(toastT('profile_image_deleted_success'), 'success');
    } catch {
      handleClick(toastT('profile_update_failed'), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      image,
      firstName,
      lastName,
      phone1,
      phone2,
      email,
      wilaya,
      commune,
    } = formData;
    const newErrors = {};

    const noChange =
      !image &&
      (!firstName || firstName === data.firstName) &&
      (!lastName || lastName === data.lastName) &&
      (!phone1 || phone1 === data.phone1) &&
      (!phone2 || phone2 === data.phone2) &&
      (!email || email === data.email) &&
      (!wilaya || wilaya === data.wilaya) &&
      (!commune || commune === data.commune);

    if (noChange) newErrors.validate = t('edit_form.errors.no_change');

    const phoneRegex = /^0[5-7][0-9]{8}$/;
    if (firstName && firstName.trim().length < 3)
      newErrors.firstName = t('edit_form.errors.first_name_min');
    if (lastName && lastName.trim().length < 3)
      newErrors.lastName = t('edit_form.errors.last_name_min');
    if (wilaya && !commune)
      newErrors.commune = t('edit_form.errors.commune_required');
    if (commune && !wilaya)
      newErrors.wilaya = t('edit_form.errors.wilaya_required');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = t('edit_form.errors.email_invalid');
    if (phone1 && !phoneRegex.test(phone1))
      newErrors.phone1 = t('edit_form.errors.phone_invalid');
    if (phone2 && !phoneRegex.test(phone2))
      newErrors.phone2 = t('edit_form.errors.phone_invalid');
    if (phone1 && phone2 && phone1 === phone2)
      newErrors.phone2 = t('edit_form.errors.phone2_same');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const send_data = new FormData();
    if (image) send_data.append('image', image);
    if (firstName) send_data.append('first_name', firstName);
    if (lastName) send_data.append('last_name', lastName);
    if (phone1)
      send_data.append(
        'phone_numbers',
        JSON.stringify(phone2 ? [phone1, phone2] : [phone1])
      );
    if (email) send_data.append('username', email);
    if (wilaya || commune)
      send_data.append(
        'address_line',
        JSON.stringify({
          ...(wilaya && { wilaya }),
          ...(commune && { baldya: commune }),
        })
      );

    setLoading(true);
    try {
      const res = await apiFetch(`https://${URL}/api/account/me/`, {
        method: 'PATCH',
        body: send_data,
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrors({
          validate: errorData.error || t('edit_form.errors.update_failed'),
          ...errorData,
        });
        throw new Error();
      }
      handleClick(toastT('profile_update_success'), 'success');
      setOpenEdit(false);
      setErrors({});
      fetchOrders();
    } catch {
      handleClick(toastT('profile_update_failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch(`https://${URL}/api/Send_otp_Code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.email }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrors({
          validate: errorData.error || t('password_form.errors.send_failed'),
          email: errorData.email || '',
        });
        throw new Error();
      }
      handleClick(toastT('code_sent_success'), 'success');
      if (passwordFormRef.current) {
        passwordFormRef.current.style.height =
          passwordFormRef.current.scrollHeight - 45 + 'px';
      }
      setPasswordStep('verify');
    } catch {
      handleClick(toastT('profile_update_failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passwordFormRef.current) {
      // نضع الارتفاع auto أولاً ليحسب الـ scrollHeight الحقيقي الجديد
      passwordFormRef.current.style.height = 'auto';
      // ثم نطبق الارتفاع الجديد
      passwordFormRef.current.style.height =
        passwordFormRef.current.scrollHeight + 'px';
    }
  }, [errors]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { code, password, confirmPassword } = formData;
    const newErrors = {};

    if (!code) newErrors.code = t('password_form.errors.code_required');
    if (!password)
      newErrors.password = t('password_form.errors.password_required');
    else if (password.length < 6)
      newErrors.password = t('password_form.errors.password_min');
    if (!confirmPassword)
      newErrors.confirmPassword = t('password_form.errors.confirm_required');
    else if (password !== confirmPassword)
      newErrors.confirmPassword = t('password_form.errors.confirm_mismatch');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const send_data = new FormData();
    send_data.append('password', confirmPassword);
    send_data.append('code', code);

    try {
      const res = await apiFetch(`https://${URL}/api/account/me/`, {
        method: 'PATCH',
        body: send_data,
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrors({
          validate: errorData.error || t('edit_form.errors.update_failed'),
          password: errorData.password || '',
          code: errorData.code || '',
        });
        throw new Error();
      }
      handleClick(toastT('password_updated_success'), 'success');
      setOpenPassword(false);
      setPasswordStep('send');
      setErrors({});
    } catch {
      handleClick(toastT('profile_update_failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const closePasswordModal = () => {
    setOpenPassword(false);
    setPasswordStep('send');
    setErrors({});
    if (passwordFormRef.current) passwordFormRef.current.style.height = '0px';
  };

  return (
    <>
      <main>
        <div className="order-container">
          {/* الملف الشخصي */}
          <div className="profile">
            <div className="profile-view">
              <div className="img-edit">
                <button className="edit" onClick={() => setOpenEdit(true)}>
                  <EditIcon />
                </button>
                <img src={profile.image || '/default.jpg'} alt="profile" />
              </div>
              <h1>
                {profile.first_name} {profile.last_name}
              </h1>
              <p
                className={`status ${profile.checked ? 'active' : 'disactive'}`}
              >
                {profile.checked ? t('profile.active') : t('profile.inactive')}
              </p>
              <div>
                <p>
                  <EmailIcon /> {profile.username || '@gmail.com'}
                </p>
                {Array.isArray(profile.phone_numbers) &&
                profile.phone_numbers.length > 0 ? (
                  <p>
                    <PhoneIcon /> {profile.phone_numbers[0]}
                    {profile.phone_numbers[1] &&
                      ` / ${profile.phone_numbers[1]}`}
                  </p>
                ) : (
                  <p>{t('profile.no_phone')}</p>
                )}
                {profile?.address_line?.wilaya && (
                  <p>
                    <LocationIcon /> {profile.address_line.wilaya} /{' '}
                    {profile.address_line.baldya}
                  </p>
                )}
              </div>
              {!data.checked && (
                <p className="active-account">
                  {t('profile.activate_msg')}{' '}
                  <span>{t('profile.activate_link')}</span>
                </p>
              )}
            </div>
          </div>

          {/* رأس قسم الطلبات */}
          <div className="order--header">
            <div className="headerTop">
              <div className="titleSection">
                <h1>{t('header.title')}</h1>
                <p className="subtitle">{t('header.subtitle')}</p>
              </div>
            </div>
            <div className="controls">
              <div className="searchBox">
                <SearchIcon className="searchIcon" />
                <input
                  type="text"
                  placeholder={t('header.search_placeholder')}
                  className="searchInput"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filterButtons">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    className={`filterBtn ${activeFilter === filter.key ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* المحتوى */}
          {loding ? (
            <div className="loading_contener">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              {/* الإحصائيات */}
              <div className="statsGrid">
                <StatCard
                  icon={<PackageIcon />}
                  label={t('stats.total_orders')}
                  value={stats.total}
                  color="blue"
                />
                <StatCard
                  icon={<CheckIcon />}
                  label={t('stats.delivered')}
                  value={stats.delivered}
                  color="green"
                />
                <StatCard
                  icon={<ClockIcon />}
                  label={t('stats.in_progress')}
                  value={stats.processing}
                  color="orange"
                />
                <StatCard
                  icon={<XIcon />}
                  label={t('stats.cancelled')}
                  value={stats.cancelled}
                  color="red"
                />
              </div>

              {/* قائمة الطلبات */}
              <div className="order-list">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <div className="emptyState">
                    <div className="emptyIcon">📭</div>
                    <h3>{t('empty.title')}</h3>
                    <p>{t('empty.subtitle')}</p>
                    <button
                      className="btn btnPrimary"
                      onClick={() => {
                        setActiveFilter('all');
                        setSearchQuery('');
                      }}
                    >
                      {t('empty.clear_filters')}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ─── نافذة تعديل الملف الشخصي ─── */}
      <div
        className="fixed-body"
        style={{ display: openEdit ? 'flex' : 'none' }}
      >
        <form className="form-body" onSubmit={handleSubmit} noValidate>
          {/* صورة الملف الشخصي */}
          <div className="edit_img">
            <div className="img">
              {(formData.image || data.image) && (
                <button
                  type="button"
                  className="delete"
                  onClick={handleDeleteImage}
                >
                  <XIcon />
                </button>
              )}
              <img
                src={
                  formData.image
                    ? window.URL.createObjectURL(formData.image)
                    : data.image || '/default.jpg'
                }
                alt="preview"
              />
            </div>
            <div className="input">
              <label htmlFor="file_input">
                <span className="material-symbols-outlined">edit</span>
              </label>
              <input
                id="file_input"
                type="file"
                name="image"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.tif,.webp,.ico"
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    image: e.target.files[0],
                  }));
                  console.log(e.target.files[0]);
                }}
              />
            </div>
          </div>

          {/* الاسم واللقب */}
          <div className="form-grid-2">
            <Field
              label={t('edit_form.first_name')}
              required
              error={errors.firstName}
              icon={<PersonIcon />}
            >
              <input
                type="text"
                name="firstName"
                value={formData.firstName || data.firstName || ''}
                onChange={handleChange}
                placeholder={t('edit_form.placeholders.first_name')}
                className={`form-input${errors.firstName ? ' error' : ''}`}
              />
            </Field>
            <Field
              label={t('edit_form.last_name')}
              required
              error={errors.lastName}
              icon={<PersonIcon />}
            >
              <input
                type="text"
                name="lastName"
                value={formData.lastName || data.lastName || ''}
                onChange={handleChange}
                placeholder={t('edit_form.placeholders.last_name')}
                className={`form-input${errors.lastName ? ' error' : ''}`}
              />
            </Field>
          </div>

          {/* الولاية والبلدية */}
          <div className="Wilaya">
            <Field
              label={t('edit_form.wilaya')}
              required
              error={errors.wilaya}
              icon={<LocationIcon />}
            >
              <select
                name="wilaya"
                value={formData.wilaya || data.wilaya || ''}
                onChange={handleChange}
                className={`form-select${errors.wilaya ? ' error' : ''}`}
              >
                <option value="">
                  {t('edit_form.placeholders.select_wilaya')}
                </option>
                {wilayas.map((w) => (
                  <option key={w.code} value={w.name.toString()}>
                    {w.code.toString().padStart(2, '0')} - {w.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label={t('edit_form.commune')}
              required
              error={errors.commune}
              icon={<HomeIcon />}
            >
              <select
                name="commune"
                value={formData.commune || data.commune || ''}
                onChange={handleChange}
                disabled={!activeWilaya}
                className={`form-select${errors.commune ? ' error' : ''}`}
              >
                <option value="">
                  {activeWilaya
                    ? t('edit_form.placeholders.select_commune')
                    : t('edit_form.placeholders.select_wilaya_first')}
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
              {t('edit_form.contact_divider')}
            </span>
            <div className="section-divider-line" />
          </div>

          {/* البريد الإلكتروني */}
          <Field
            label={t('edit_form.email')}
            required
            error={errors.email}
            icon={<EmailIcon />}
          >
            <input
              type="text"
              name="email"
              value={formData.email || data.email || ''}
              onChange={handleChange}
              placeholder={t('edit_form.placeholders.email')}
              className={`form-input${errors.email ? ' error' : ''}`}
            />
          </Field>

          {/* الهاتف */}
          <div className="phone">
            <Field
              label={t('edit_form.phone1')}
              required
              error={errors.phone1}
              icon={<PhoneIcon />}
            >
              <input
                type="tel"
                name="phone1"
                value={formData.phone1 || data.phone1 || ''}
                onChange={handleChange}
                placeholder={t('edit_form.placeholders.phone1')}
                maxLength={10}
                className={`form-input phone-input${errors.phone1 ? ' error' : ''}`}
              />
            </Field>
            <Field
              label={t('edit_form.phone2')}
              error={errors.phone2}
              hint={t('edit_form.phone2_hint')}
              icon={<PhoneIcon />}
            >
              <input
                type="tel"
                name="phone2"
                value={formData.phone2 || data.phone2 || ''}
                onChange={handleChange}
                placeholder={t('edit_form.placeholders.phone2')}
                maxLength={10}
                className={`form-input phone-input${errors.phone2 ? ' error' : ''}`}
              />
            </Field>
          </div>

          {/* زر تغيير كلمة المرور */}
          <button
            type="button"
            className="Password"
            onClick={() => {
              setOpenEdit(false);
              setOpenPassword(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="blue"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              <path d="M12 16v3" />
              <path d="M10 17l2 2 2-2" />
            </svg>
            {t('edit_form.change_password_btn')}
          </button>

          <Field error={errors.validate}>
            <div className="btn">
              <button
                type="button"
                className="btn-submit cancel"
                disabled={loading}
                onClick={() => setOpenEdit(false)}
              >
                {t('edit_form.cancel_btn')}
              </button>
              <SpinnerButton
                loading={loading}
                label={t('edit_form.save_btn')}
                className="save"
              />
            </div>
          </Field>

          <p className="form-note">{t('edit_form.security_note')}</p>
        </form>
      </div>

      {/* ─── نافذة تغيير كلمة المرور ─── */}
      <div
        className="fixed-body"
        style={{ display: openPassword ? 'flex' : 'none' }}
      >
        <form
          className="code-body"
          onSubmit={
            passwordStep === 'send' ? handleSendCode : handleChangePassword
          }
          noValidate
        >
          <h3>
            {passwordStep === 'verify'
              ? t('password_form.title_sent')
              : t('password_form.title_send')}
          </h3>

          <div
            className="inputs"
            style={{
              transform:
                passwordStep === 'verify'
                  ? locale === 'ar'
                    ? 'translateX(330px)'
                    : 'translateX(-330px)'
                  : '',
            }}
          >
            <Field
              label={t('password_form.email_label')}
              error={errors.email}
              icon={<EmailIcon />}
            >
              <input
                type="text"
                name="email"
                value={data.email || ''}
                disabled
                className="form-input"
              />
            </Field>
            <div
              ref={passwordFormRef}
              style={{
                height: 0,
                overflow: passwordStep === 'verify' ? '' : 'hidden',
                transition: 'height 0.3s ease',
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
              }}
            >
              <Field
                label={t('password_form.code_label')}
                error={errors.code}
                icon={<PasswordStarsIcon />}
                required
              >
                <input
                  type="tel"
                  name="code"
                  onChange={handleChange}
                  maxLength={6}
                  className={`form-input phone-input${errors.code ? ' error' : ''}`}
                />
              </Field>
              <Field
                label={t('password_form.password_label')}
                required
                error={errors.password}
                icon={<PasswordIcon />}
              >
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('password_form.placeholders.password')}
                  className={`form-input${errors.password ? ' error' : ''}`}
                />
              </Field>
              <Field
                label={t('password_form.confirm_password_label')}
                required
                error={errors.confirmPassword}
                icon={<PasswordCheckIcon />}
              >
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t('password_form.placeholders.confirm_password')}
                  className={`form-input${errors.confirmPassword ? ' error' : ''}`}
                />
              </Field>
            </div>
          </div>

          <Field error={errors.validate}>
            <div className="btn">
              <button
                type="button"
                className="btn-submit cancel"
                disabled={loading}
                onClick={closePasswordModal}
              >
                {t('password_form.cancel_btn')}
              </button>
              <SpinnerButton
                loading={loading}
                label={t('password_form.send_btn')}
                className="save"
              />
            </div>
          </Field>
        </form>
      </div>
    </>
  );
}
