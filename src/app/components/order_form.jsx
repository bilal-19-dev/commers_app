'use client';
import { useState, useEffect, useCallback } from 'react';
import { wilayas } from '../data/Wilaya.js';
import { Use_them } from '../hooks/ThemProvider';
import { URL } from '../data/URL.js';
import {
  CloseIcon,
  PersonIcon,
  HomeIcon,
  LocationIcon,
  PhoneIcon,
} from '../data/Icons.jsx';
import { apiFetch } from '../data/FETCH.js';
import { useTranslations } from 'next-intl';

// ─── Spinner مشترك ───────────────────────────────────────────────
function Spinner({ color = 'white' }) {
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

// ─── المكوّن الرئيسي ─────────────────────────────────────────────
export default function Order_form_components() {
  const t = useTranslations('order_form');
  const [delivery, setDelivery] = useState(20);
  const [step, setStep] = useState(false);

  return (
    <main>
      <div className="order-form-content">
        <div className="page-title">
          <h1>{t('page.title')}</h1>
          <p>{t('page.subtitle')}</p>
          <div className="steps">
            <StepItem number={1} label={t('steps.product')} active />
            <div className="step-divider" />
            <StepItem number={2} label={t('steps.info')} active />
            <div className={`step-divider ${step ? 'active' : 'inactive'}`} />
            <StepItem number={3} label={t('steps.confirm')} active={step} />
          </div>
        </div>

        <div className="layout-grid">
          <div className="order-form-col">
            <OrderForm setDelivery={setDelivery} step={setStep} />
          </div>
          <div className="order-product-col col-sticky">
            <ProductCard delivery={delivery} />
            <div className="trust-grid">
              <TrustBadge
                icon="🔒"
                text={t('trust.secure_pay')}
                sub={t('trust.secure_pay_sub')}
              />
              <TrustBadge
                icon="🚚"
                text={t('trust.fast_delivery')}
                sub={t('trust.fast_delivery_sub')}
              />
              <TrustBadge
                icon="↩️"
                text={t('trust.free_return')}
                sub={t('trust.free_return_sub')}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── StepItem ────────────────────────────────────────────────────
function StepItem({ number, label, active }) {
  return (
    <div className="step-item">
      <div className={`step-circle ${active ? 'active' : 'inactive'}`}>
        {number}
      </div>
      <span className={`step-label ${active ? 'active' : 'inactive'}`}>
        {label}
      </span>
    </div>
  );
}

// ─── TrustBadge ──────────────────────────────────────────────────
function TrustBadge({ icon, text, sub }) {
  return (
    <div className="trust-item">
      <div className="trust-icon">{icon}</div>
      <p className="trust-text">{text}</p>
      <p className="trust-sub">{sub}</p>
    </div>
  );
}

// ─── OrderForm ───────────────────────────────────────────────────
function OrderForm({ setDelivery, step }) {
  const t = useTranslations('order_form');
  const toastT = useTranslations('toast');
  const { setmessge, setSeverity, setsnack } = Use_them();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    wilaya: '',
    commune: '',
    phone1: '',
    phone2: '',
    delivery_type: 'normal',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedWilaya = wilayas.find(
    (w) => w.code.toString() === formData.wilaya
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      name === 'wilaya'
        ? { ...prev, wilaya: value, commune: '' }
        : { ...prev, [name]: value }
    );
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ─── التحقق من المدخلات وإرسال الطلب ────────────────────────
  const validate = async () => {
    const newErrors = {};
    const phoneRegex = /^0[5-7][0-9]{8}$/;

    if (!formData.firstName.trim())
      newErrors.firstName = t('errors.first_name_required');
    else if (formData.firstName.trim().length < 2)
      newErrors.firstName = t('errors.first_name_min_length');

    if (!formData.lastName.trim())
      newErrors.lastName = t('errors.last_name_required');
    else if (formData.lastName.trim().length < 2)
      newErrors.lastName = t('errors.last_name_min_length');

    if (!formData.wilaya) newErrors.wilaya = t('errors.wilaya_required');
    if (!formData.commune) newErrors.commune = t('errors.commune_required');

    if (!formData.phone1.trim()) newErrors.phone1 = t('errors.phone1_required');
    else if (!phoneRegex.test(formData.phone1))
      newErrors.phone1 = t('errors.phone_invalid');

    if (formData.phone2.trim() && !phoneRegex.test(formData.phone2))
      newErrors.phone2 = t('errors.phone_invalid');

    if (
      formData.phone1 &&
      formData.phone2 &&
      formData.phone1 === formData.phone2
    )
      newErrors.phone2 = t('errors.phone2_same_as_phone1');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    // بناء payload وإرسال الطلب
    const storedOrders = localStorage.getItem('order_info');
    const orders = storedOrders ? JSON.parse(storedOrders) : [];

    try {
      const res = await apiFetch(`https://${URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orders.map((order) => ({
            product: order.prodect.id,
            quantity: order.order_info.quantity,
            color: order.order_info.color,
          })),
          deliveries: [
            {
              delivery_address: {
                wilaya: selectedWilaya?.name ?? formData.wilaya,
                baldya: formData.commune,
              },
              delivery_phone: formData.phone2
                ? [formData.phone1, formData.phone2]
                : [formData.phone1],
              first_name: formData.firstName,
              last_name: formData.lastName,
              delivery_type: formData.delivery_type,
            },
          ],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrors({ validate: t('errors.product_unavailable') });
        handleClick(toastT('order_send_failed'), 'error');
        console.error(errorData);
        return false;
      }

      handleClick(toastT('order_sent_success'), 'success');
      return true;
    } catch {
      handleClick(toastT('order_send_failed'), 'error');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await validate();
    setLoading(false);
    if (!ok) return;
    setSubmitted(true);
    step(true);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      wilaya: '',
      commune: '',
      phone1: '',
      phone2: '',
      delivery_type: 'normal',
    });
    setErrors({});
    setSubmitted(false);
    step(false);
  };

  // ─── شاشة النجاح ─────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="card">
        <div className="card-header-blue">
          <div className="card-header-title">
            <svg viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h2>{t('buyer_info.title')}</h2>
          </div>
        </div>

        <div className="success-body">
          <div className="success-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="success-title">{t('success.title')}</h3>
          <p className="success-subtitle">{t('success.subtitle')}</p>

          <div className="success-info-box">
            <InfoRow
              label={t('success.full_name')}
              value={`${formData.firstName} ${formData.lastName}`}
              icon="👤"
            />
            <InfoRow
              label={t('success.wilaya')}
              value={selectedWilaya?.name ?? formData.wilaya}
              icon="📍"
            />
            <InfoRow
              label={t('success.commune')}
              value={formData.commune}
              icon="🏘️"
            />
            <InfoRow
              label={t('success.phone1')}
              value={formData.phone1}
              icon="📱"
              ltr
            />
            {formData.phone2 && (
              <InfoRow
                label={t('success.phone2')}
                value={formData.phone2}
                icon="📞"
                ltr
              />
            )}
            <InfoRow
              label={t('success.delivery')}
              value={
                formData.delivery_type === 'normal'
                  ? t('success.delivery_normal')
                  : t('success.delivery_fast')
              }
              icon="🚚"
            />
          </div>

          <button className="btn-new-order" onClick={handleReset}>
            <svg viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t('success.new_order')}
          </button>
        </div>
      </div>
    );
  }

  // ─── النموذج ─────────────────────────────────────────────────
  return (
    <div className="card">
      <div className="card-header-blue">
        <div className="card-header-title">
          <svg viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h2>{t('buyer_info.title')}</h2>
        </div>
        <p className="card-header-subtitle">{t('buyer_info.subtitle')}</p>
      </div>

      <form className="form-body" onSubmit={handleSubmit} noValidate>
        {/* الاسم واللقب */}
        <div className="form-grid-2">
          <Field
            label={t('fields.first_name')}
            required
            error={errors.firstName}
            icon={<PersonIcon />}
          >
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t('placeholders.first_name')}
              className={`form-input${errors.firstName ? ' error' : ''}`}
            />
          </Field>
          <Field
            label={t('fields.last_name')}
            required
            error={errors.lastName}
            icon={<PersonIcon />}
          >
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t('placeholders.last_name')}
              className={`form-input${errors.lastName ? ' error' : ''}`}
            />
          </Field>
        </div>

        {/* الولاية */}
        <Field
          label={t('fields.wilaya')}
          required
          error={errors.wilaya}
          icon={<LocationIcon />}
        >
          <select
            name="wilaya"
            value={formData.wilaya}
            onChange={handleChange}
            className={`form-select${errors.wilaya ? ' error' : ''}`}
          >
            <option value="">{t('placeholders.select_wilaya')}</option>
            {wilayas.map((w) => (
              <option key={w.code} value={w.code.toString()}>
                {w.code.toString().padStart(2, '0')} - {w.name}
              </option>
            ))}
          </select>
        </Field>

        {/* البلدية */}
        <Field
          label={t('fields.commune')}
          required
          error={errors.commune}
          icon={<HomeIcon />}
        >
          <select
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            disabled={!formData.wilaya}
            className={`form-select${errors.commune ? ' error' : ''}`}
          >
            <option value="">
              {formData.wilaya
                ? t('placeholders.select_commune')
                : t('placeholders.select_wilaya_first')}
            </option>
            {communes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <div className="section-divider">
          <div className="section-divider-line" />
          <span className="section-divider-text">
            {t('delivery.section_title')}
          </span>
          <div className="section-divider-line" />
        </div>

        {/* الهاتف */}
        <Field
          label={t('fields.phone1')}
          required
          error={errors.phone1}
          icon={<PhoneIcon />}
        >
          <input
            type="tel"
            name="phone1"
            value={formData.phone1}
            onChange={handleChange}
            placeholder={t('placeholders.phone1')}
            maxLength={10}
            className={`form-input phone-input${errors.phone1 ? ' error' : ''}`}
          />
        </Field>
        <Field
          label={t('fields.phone2')}
          error={errors.phone2}
          hint={t('hints.phone2_optional')}
          icon={<PhoneIcon />}
        >
          <input
            type="tel"
            name="phone2"
            value={formData.phone2}
            onChange={handleChange}
            placeholder={t('placeholders.phone2')}
            maxLength={10}
            className={`form-input phone-input${errors.phone2 ? ' error' : ''}`}
          />
        </Field>

        {/* نوع التوصيل */}
        <div className="Delivery-options">
          {[
            { type: 'fast', price: 50 },
            { type: 'normal', price: 20 },
          ].map(({ type, price }) => (
            <div
              key={type}
              className={`option ${formData.delivery_type === type ? 'active' : ''}`}
              onClick={() => {
                setFormData((prev) => ({ ...prev, delivery_type: type }));
                setDelivery(price);
              }}
            >
              <h3>{t(`delivery.${type}_title`)}</h3>
              <p>{t(`delivery.${type}_desc`)}</p>
              <p>{t(`delivery.${type}_price`)}</p>
            </div>
          ))}
        </div>

        {/* إرسال */}
        <Field error={errors.validate}>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                {t('submit.confirming')}
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t('submit.confirm')}
              </>
            )}
          </button>
        </Field>

        <p className="form-note">{t('submit.security_note')}</p>
      </form>
    </div>
  );
}

// ─── Field ───────────────────────────────────────────────────────
export function Field({ label, required, error, hint, icon, children }) {
  return (
    <div className="form-field">
      {label && (
        <div className="field-label-row">
          <label className="field-label">
            {icon}
            {label}
            {required && <span className="required-star"> *</span>}
          </label>
          {hint && <span className="field-hint">{hint}</span>}
        </div>
      )}
      {children}
      {error && (
        <p className="field-error">
          <svg viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── InfoRow ─────────────────────────────────────────────────────
export function InfoRow({ label, value, icon, ltr = false }) {
  return (
    <div className="info-row">
      <span className="info-row-label">{label}</span>
      <span className="info-row-value" dir={ltr ? 'ltr' : undefined}>
        <span>{icon}</span> {value}
      </span>
    </div>
  );
}

// ─── ProductCard ─────────────────────────────────────────────────
function ProductCard({ delivery }) {
  const t = useTranslations('order_form');
  const toastT = useTranslations('toast');
  const { setmessge, setSeverity, setsnack } = Use_them();
  const [loading, setLoading] = useState(true);
  const [orderForm, setOrderForm] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('order_info');
    setOrderForm(stored ? JSON.parse(stored) : []);
    setLoading(false);
  }, []);

  const handleClick = useCallback(
    (msg, sev) => {
      setmessge(msg);
      setSeverity(sev);
      setsnack(true);
    },
    [setmessge, setSeverity, setsnack]
  );

  const handleDeleteItem = (i) => {
    const updated = orderForm.filter((_, idx) => idx !== i);
    localStorage.setItem('order_info', JSON.stringify(updated));
    setOrderForm(updated);
    handleClick(toastT('product_removed_from_order_success'), 'success');
  };

  const total = orderForm.reduce(
    (sum, order) =>
      sum + Number(order.prodect.price) * order.order_info.quantity,
    0
  );

  return (
    <div className="card">
      <div className="card-header-green">
        <div className="card-header-title">
          <svg viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2>{t('product_card.title')}</h2>
        </div>
      </div>

      <div className="product-body">
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Spinner color="black" />
          </div>
        ) : (
          orderForm.map((order, i) => (
            <div
              key={`${order.prodect?.id ?? 'order'}-${i}`}
              className={orderForm.length > 1 ? 'prodects' : ''}
            >
              <div className="product-top">
                {orderForm.length > 1 && (
                  <button
                    className="btn-close"
                    onClick={() => handleDeleteItem(i)}
                  >
                    <CloseIcon />
                  </button>
                )}
                <div className="product-image-wrap">
                  <img
                    src={order.prodect.primary_image}
                    alt={order.prodect.name}
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112' viewBox='0 0 112 112'%3E%3Crect width='112' height='112' fill='%23f3f4f6'/%3E%3Ctext x='56' y='56' text-anchor='middle' dominant-baseline='middle' font-size='40'%3E🛍️%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="product-info">
                  <span className="product-category">
                    {t('product_card.category')}
                  </span>
                  <h3 className="product-name">{order.prodect.name}</h3>
                  <p className="product-desc">{order.prodect.description}</p>
                </div>
              </div>

              <hr className="divider-dashed" />

              <div className="detail-grid">
                <DetailItem
                  icon="🎨"
                  label={t('product_card.color')}
                  value={order.order_info.color}
                />
                <DetailItem
                  icon="📏"
                  label={t('product_card.size')}
                  value={order.order_info.size}
                />
                <DetailItem
                  icon="📦"
                  label={t('product_card.quantity')}
                  value={order.order_info.quantity}
                />
                <DetailItem
                  icon="💰"
                  label={t('product_card.price')}
                  value={`${order.prodect.price} ${t('product_card.currency')}`}
                  green
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="product-footer">
        <span>{t('product_card.total')}</span>
        <span className="shipping-badge">
          <span className="pulse-dot" />
          {(total + delivery).toFixed(2)} {t('product_card.currency')}
        </span>
      </div>
    </div>
  );
}

// ─── DetailItem ──────────────────────────────────────────────────
function DetailItem({ icon, label, value, green = false }) {
  return (
    <div className="detail-item">
      <span className="detail-icon">{icon}</span>
      <div>
        <p className="detail-label">{label}</p>
        <p className={`detail-value${green ? ' green' : ''}`}>{value}</p>
      </div>
    </div>
  );
}
