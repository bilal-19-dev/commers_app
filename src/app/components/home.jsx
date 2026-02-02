"use client";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import Collapse from "@mui/material/Collapse";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  useDeviceDimensions,
  useViewportSize,
} from "../hooks/useDeviceDimensions";
import {
  calculateOptimalDimensions,
  calculateOptimalGridColumns,
  calculateOptimalSpacing,
  calculateOptimalFontSizes,
  getPerformanceSettings,
} from "../utils/deviceUtils";
import Link from "next/link";
import { WILAYAS_DATA } from "../data/Wilaya.js";
import { URL } from "../data/URL.js";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTheme } from "@emotion/react";
import { Account } from "../data/FETCH.js";
import { Use_them } from "../hooks/ThemProvider";

const SnackbarAlert = React.forwardRef(function SnackbarAlert(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home_component({ data }) {
  const prodect = data;
  if (typeof window !== "undefined") {
    console.log(window.innerWidth, ".......");
  }
  const deviceDimensions = useDeviceDimensions();
  const viewportSize = useViewportSize();

  // استخدام المقاسات الحقيقية للجهاز
  const isMobile = deviceDimensions.isMobile;
  const isTablet = deviceDimensions.isTablet;
  const isDesktop = deviceDimensions.isDesktop;
  const isLandscape = deviceDimensions.isLandscape;
  const isPortrait = deviceDimensions.isPortrait;

  // حساب المقاسات المثالية باستخدام الدوال المساعدة
  const optimalDimensions = calculateOptimalDimensions(deviceDimensions);
  const optimalSpacing = calculateOptimalSpacing(
    viewportSize.width,
    viewportSize.height
  );
  const optimalFontSizes = calculateOptimalFontSizes(
    viewportSize.width,
    viewportSize.height
  );
  const performanceSettings = getPerformanceSettings(deviceDimensions);

  // حساب عدد الأعمدة المثالي للشبكة
  const gridColumns = calculateOptimalGridColumns(
    viewportSize.width - optimalDimensions.sidebarWidth,
    optimalDimensions.cardMinWidth,
    optimalDimensions.cardMaxWidth
  );
  return (
    <>
      <main>
        <div className="prodect-container">
          <section className="sidebar">
            <Sidebar
              isMobile={isMobile}
              setIsMobile={() => {}}
              deviceDimensions={deviceDimensions}
            />
          </section>
          <section className="middle">
            <div className="container">
              {prodect.map((item) => {
                console.log(item, "-*-****");
                return (
                  <ProductCard
                    key={item.id}
                    deviceDimensions={deviceDimensions}
                    value={item}
                  />
                );
              })}
              {/* <ProductCard deviceDimensions={deviceDimensions} />
                <ProductCard deviceDimensions={deviceDimensions} />
                <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCardSpecial deviceDimensions={deviceDimensions} />
              <ProductCardDiscount deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} />
              <ProductCard deviceDimensions={deviceDimensions} /> */}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function Header_content({ setvalue, deviceDimensions, viewportSize }) {
  const [open, setOpen] = useState(null);
  const [car, setcar] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const { cart, loged } = Use_them();
  useEffect(() => {
    Account();
  }, []);
  useEffect(() => {
    setcar(cart.reduce((sum, item) => sum + item.quantity * 0 + 1, 0));
  });
  const handleClicklang = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(null);
  };
  const handle_Logout = async () => {
    const data = { username: "@Anonimo", password: "@A.123456" };
    localStorage.setItem("logeed", "false");
    await fetch(`http://${URL}:8000/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    window.location.reload();
  };
  // استخدام المقاسات الديناميكية
  const searchWidth = deviceDimensions.isMobile
    ? Math.min(275, (viewportSize.width || 1200) * 0.7)
    : Math.min(550, (viewportSize.width || 1200) * 0.4);
  return (
    <header>
      <nav>
        <div className="nav-container">
          <div className="logo">
            <h1 style={{ fontSize: "1.2rem" }}>Logo</h1>
          </div>
          <div className="content">
            <div className="search-bar">
              <input
                className="search-input"
                type="search"
                placeholder="Search..."
              />
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#3b82f6", fontSize: "1.2rem" }}
                >
                  search
                </span>
              </button>
            </div>
          </div>
          {viewportSize.width <= 760 ? (
            <div className="nav-links">
              <>
                <Link href="/car">
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#3b82f6", fontSize: "2rem" }}
                    >
                      shopping_cart_checkout
                    </span>
                    <span style={{ marginLeft: "5px" }}>{car}</span>
                  </button>
                </Link>
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    onClick={handleClicklang}
                    style={{ color: "#3b82f6", fontSize: "2rem" }}
                  >
                    translate
                  </span>
                </button>
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  onClick={handleClickMenu}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: "#3b82f6",
                      fontSize: viewportSize.width <= 320 ? "1.2rem" : "1.5rem",
                    }}
                  >
                    menu
                  </span>
                </button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <Link href="/" passHref legacyBehavior>
                    <MenuItem onClick={handleClose} component="a">
                      Home
                    </MenuItem>
                  </Link>
                  <Link href="/orders" passHref legacyBehavior>
                    <MenuItem onClick={handleClose} component="a">
                      Orders
                    </MenuItem>
                  </Link>
                  <Link href="/profile">
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                  </Link>
                  {loged ? (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        setvalue("flex");
                      }}
                    >
                      Logout
                      <span className="material-symbols-outlined">logout</span>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        handle_Logout();
                      }}
                    >
                      Login
                      <span className="material-symbols-outlined">logout</span>
                    </MenuItem>
                  )}
                  {/* <MenuItem onClick={() => { handleClose(); setvalue('flex'); }}>Login</MenuItem>
                  <MenuItem onClick={() => { handleClose(); setvalue('flex'); }}>Log out</MenuItem> */}
                </Menu>
                <Menu
                  anchorEl={open}
                  open={Boolean(open)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>ar</MenuItem>
                  <MenuItem onClick={handleClose}>en</MenuItem>
                  <MenuItem onClick={handleClose}>fr</MenuItem>
                </Menu>
              </>
            </div>
          ) : (
            <div className="nav-links">
              <ul>
                <Link href="/">
                  <li>Home</li>
                </Link>
                <Link href="/orders">
                  <li>Orders</li>
                </Link>
              </ul>
              <Link href="/car">
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#3b82f6", fontSize: "2rem" }}
                  >
                    shopping_cart_checkout
                  </span>
                  <span style={{ marginLeft: "5px" }}>{car}</span>
                </button>
              </Link>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  onClick={handleClicklang}
                  style={{ color: "#3b82f6", fontSize: "2rem" }}
                >
                  translate
                </span>
              </button>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
                onClick={handleClickMenu}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: "#3b82f6",
                    fontSize: viewportSize.width <= 320 ? "1.2rem" : "1.5rem",
                  }}
                >
                  menu
                </span>
              </button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Link href="/profile">
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Link>
                {JSON.parse(localStorage.getItem("logeed")) ? (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handle_Logout();
                    }}
                  >
                    Logout
                    <span className="material-symbols-outlined">logout</span>
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setvalue("flex");
                    }}
                  >
                    Login
                    <span className="material-symbols-outlined">login</span>
                  </MenuItem>
                )}{" "}
              </Menu>
              <Menu anchorEl={open} open={open} onClose={handleClose}>
                <MenuItem onClick={handleClose}>ar</MenuItem>
                <MenuItem onClick={handleClose}>en</MenuItem>
                <MenuItem onClick={handleClose}>fr</MenuItem>
              </Menu>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function Sidebar({ isMobile, setIsMobile, deviceDimensions }) {
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1070);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsMobile]);

  const [Collapsed, setCollapsed] = useState(true);
  const handleToggle = () => {
    setCollapsed(!Collapsed);
  };

  // استخدام المقاسات الديناميكية للخطوط
  const titleFontSize =
    deviceDimensions.isLargeScreen && deviceDimensions.width > 0
      ? "1.7rem"
      : "1.5rem";
  const filterFontSize =
    deviceDimensions.isLargeScreen && deviceDimensions.width > 0
      ? "1.1rem"
      : "1rem";
  const buttonFontSize =
    deviceDimensions.isLargeScreen && deviceDimensions.width > 0
      ? "1.2rem"
      : "1.1rem";

  if (!isMobile && !deviceDimensions.isTablet) {
    return (
      <div className="sidebar-content">
        <h2
          style={{
            fontSize: titleFontSize,
            fontWeight: 800,
            marginBottom: "24px",
            letterSpacing: "0.5px",
            color: "#3b3b3b",
            textAlign: "center",
          }}
        >
          <span role="img" aria-label="filter" style={{ marginRight: 8 }}>
            🧲
          </span>
          الفلاتر
        </h2>
        {/* Price Range */}
        <div className="filter" style={{ marginBottom: "22px" }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: "10px",
              color: "#2d6a4f",
              fontSize: filterFontSize,
            }}
          >
            نطاق السعر
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="radio"
                name="priceRange"
                value="10-100"
                style={{ accentColor: "#2d6a4f" }}
              />
              10 - 100 ريال
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="radio"
                name="priceRange"
                value="100-500"
                style={{ accentColor: "#2d6a4f" }}
              />
              100 - 500 ريال
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="radio"
                name="priceRange"
                value="500-1000"
                style={{ accentColor: "#2d6a4f" }}
              />
              500 - 1000 ريال
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="radio"
                name="priceRange"
                value="1000+"
                style={{ accentColor: "#2d6a4f" }}
              />
              أكثر من 1000 ريال
            </label>
          </div>
        </div>
        {/* Category */}
        <div className="filter" style={{ marginBottom: "22px" }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: "10px",
              color: "#2d6a4f",
              fontSize: filterFontSize,
            }}
          >
            الفئة
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="category"
                value="category1"
                style={{ accentColor: "#3b82f6" }}
              />
              إلكترونيات
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="category"
                value="category2"
                style={{ accentColor: "#3b82f6" }}
              />
              ملابس
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="category"
                value="category3"
                style={{ accentColor: "#3b82f6" }}
              />
              أجهزة منزلية
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="category"
                value="category4"
                style={{ accentColor: "#3b82f6" }}
              />
              أخرى
            </label>
          </div>
        </div>
        {/* Brand */}
        <div className="filter" style={{ marginBottom: "22px" }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: "10px",
              color: "#2d6a4f",
              fontSize: filterFontSize,
            }}
          >
            الماركة
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="brand"
                value="brand1"
                style={{ accentColor: "#f59e42" }}
              />
              سامسونج
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="brand"
                value="brand2"
                style={{ accentColor: "#f59e42" }}
              />
              أبل
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="brand"
                value="brand3"
                style={{ accentColor: "#f59e42" }}
              />
              هواوي
            </label>
          </div>
        </div>
        {/* Availability */}
        <div className="filter" style={{ marginBottom: "22px" }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: "10px",
              color: "#2d6a4f",
              fontSize: filterFontSize,
            }}
          >
            التوفر
          </div>
          <select
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: filterFontSize,
              background: "#fff",
              color: "#22223b",
            }}
          >
            <option value="all">الكل</option>
            <option value="in-stock">متوفر</option>
            <option value="out-of-stock">غير متوفر</option>
          </select>
        </div>
        {/* Rating */}
        <div className="filter" style={{ marginBottom: "22px" }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: "10px",
              color: "#2d6a4f",
              fontSize: filterFontSize,
            }}
          >
            التقييم
          </div>
          <select
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: filterFontSize,
              background: "#fff",
              color: "#22223b",
            }}
          >
            <option value="1">⭐ فأعلى</option>
            <option value="2">⭐⭐ فأعلى</option>
            <option value="3">⭐⭐⭐ فأعلى</option>
            <option value="4">⭐⭐⭐⭐ فأعلى</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>
        {/* Attributes */}
        <div className="filter" style={{ marginBottom: "10px" }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: "10px",
              color: "#2d6a4f",
              fontSize: filterFontSize,
            }}
          >
            الخصائص
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="attribute"
                value="attribute1"
                style={{ accentColor: "#a21caf" }}
              />
              جديد
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="attribute"
                value="attribute2"
                style={{ accentColor: "#a21caf" }}
              />
              الأكثر مبيعاً
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="attribute"
                value="attribute3"
                style={{ accentColor: "#a21caf" }}
              />
              شحن مجاني
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: filterFontSize,
              }}
            >
              <input
                type="checkbox"
                name="attribute"
                value="attribute4"
                style={{ accentColor: "#a21caf" }}
              />
              عروض خاصة
            </label>
          </div>
        </div>
        <button
          style={{
            marginTop: "24px",
            width: "100%",
            background: "linear-gradient(90deg, #2d6a4f 0%, #3b82f6 100%)",
            color: "#fff",
            fontWeight: 800,
            fontSize: buttonFontSize,
            border: "none",
            borderRadius: "10px",
            padding: "12px 0",
            cursor: "pointer",
            boxShadow: "0 2px 8px 0 rgba(60,72,88,0.10)",
            letterSpacing: "1px",
            transition: "background 0.2s",
          }}
        >
          <span role="img" aria-label="search" style={{ marginLeft: 8 }}>
            🔎
          </span>
          تطبيق الفلاتر
        </button>
      </div>
    );
  } else {
    return (
      <Collapse in={Collapsed} collapsedSize={50} className="sidebar-content">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: titleFontSize,
              fontWeight: 800,
              marginBottom: "24px",
              letterSpacing: "0.5px",
              color: "#3b3b3b",
              textAlign: "center",
            }}
          >
            <span role="img" aria-label="filter" style={{ marginRight: 8 }}>
              🧲
            </span>
            الفلاتر
          </h2>
          <button
            className="filter-button"
            onClick={handleToggle}
            style={{
              rotate: open ? "180deg" : "0deg",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span className="material-symbols-outlined">arrow_drop_down</span>
          </button>
        </div>
        <div
          style={{
            width: "100%",
            height: "calc(100vh - 150px)",
            overflowY: "auto",
            padding: "0 10px",
          }}
        >
          {/* Price Range */}
          <div className="filter" style={{ marginBottom: "22px" }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "10px",
                color: "#2d6a4f",
                fontSize: filterFontSize,
              }}
            >
              نطاق السعر
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="radio"
                  name="priceRange"
                  value="10-100"
                  style={{ accentColor: "#2d6a4f" }}
                />
                10 - 100 ريال
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="radio"
                  name="priceRange"
                  value="100-500"
                  style={{ accentColor: "#2d6a4f" }}
                />
                100 - 500 ريال
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="radio"
                  name="priceRange"
                  value="500-1000"
                  style={{ accentColor: "#2d6a4f" }}
                />
                500 - 1000 ريال
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="radio"
                  name="priceRange"
                  value="1000+"
                  style={{ accentColor: "#2d6a4f" }}
                />
                أكثر من 1000 ريال
              </label>
            </div>
          </div>
          {/* Category */}
          <div className="filter" style={{ marginBottom: "22px" }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "10px",
                color: "#2d6a4f",
                fontSize: filterFontSize,
              }}
            >
              الفئة
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="category"
                  value="category1"
                  style={{ accentColor: "#3b82f6" }}
                />
                إلكترونيات
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="category"
                  value="category2"
                  style={{ accentColor: "#3b82f6" }}
                />
                ملابس
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="category"
                  value="category3"
                  style={{ accentColor: "#3b82f6" }}
                />
                أجهزة منزلية
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="category"
                  value="category4"
                  style={{ accentColor: "#3b82f6" }}
                />
                أخرى
              </label>
            </div>
          </div>
          {/* Brand */}
          <div className="filter" style={{ marginBottom: "22px" }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "10px",
                color: "#2d6a4f",
                fontSize: filterFontSize,
              }}
            >
              الماركة
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="brand"
                  value="brand1"
                  style={{ accentColor: "#f59e42" }}
                />
                سامسونج
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="brand"
                  value="brand2"
                  style={{ accentColor: "#f59e42" }}
                />
                أبل
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="brand"
                  value="brand3"
                  style={{ accentColor: "#f59e42" }}
                />
                هواوي
              </label>
            </div>
          </div>
          {/* Availability */}
          <div className="filter" style={{ marginBottom: "22px" }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "10px",
                color: "#2d6a4f",
                fontSize: filterFontSize,
              }}
            >
              التوفر
            </div>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: filterFontSize,
                background: "#fff",
                color: "#22223b",
              }}
            >
              <option value="all">الكل</option>
              <option value="in-stock">متوفر</option>
              <option value="out-of-stock">غير متوفر</option>
            </select>
          </div>
          {/* Rating */}
          <div className="filter" style={{ marginBottom: "22px" }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "10px",
                color: "#2d6a4f",
                fontSize: filterFontSize,
              }}
            >
              التقييم
            </div>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: filterFontSize,
                background: "#fff",
                color: "#22223b",
              }}
            >
              <option value="1">⭐ فأعلى</option>
              <option value="2">⭐⭐ فأعلى</option>
              <option value="3">⭐⭐⭐ فأعلى</option>
              <option value="4">⭐⭐⭐⭐ فأعلى</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
            </select>
          </div>
          {/* Attributes */}
          <div className="filter" style={{ marginBottom: "10px" }}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: "10px",
                color: "#2d6a4f",
                fontSize: filterFontSize,
              }}
            >
              الخصائص
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="attribute"
                  value="attribute1"
                  style={{ accentColor: "#a21caf" }}
                />
                جديد
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="attribute"
                  value="attribute2"
                  style={{ accentColor: "#a21caf" }}
                />
                الأكثر مبيعاً
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="attribute"
                  value="attribute3"
                  style={{ accentColor: "#a21caf" }}
                />
                شحن مجاني
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: filterFontSize,
                }}
              >
                <input
                  type="checkbox"
                  name="attribute"
                  value="attribute4"
                  style={{ accentColor: "#a21caf" }}
                />
                عروض خاصة
              </label>
            </div>
          </div>
          <button
            style={{
              marginTop: "24px",
              width: "100%",
              background: "linear-gradient(90deg, #2d6a4f 0%, #3b82f6 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: buttonFontSize,
              border: "none",
              borderRadius: "10px",
              padding: "12px 0",
              cursor: "pointer",
              boxShadow: "0 2px 8px 0 rgba(60,72,88,0.10)",
              letterSpacing: "1px",
              transition: "background 0.2s",
            }}
          >
            <span role="img" aria-label="search" style={{ marginLeft: 8 }}>
              🔎
            </span>
            تطبيق الفلاتر
          </button>
        </div>
      </Collapse>
    );
  }
}

function ProductCard({ value }) {
  return (
    <Link href={`/prodect_detail/${value.id}`}>
      <div className="ProductCard">
        <div className="image">
          <img src={value.primary_image} alt="Placeholder" />
        </div>
        <hr
          style={{ border: "1px solid rgba(0, 0, 0, 0.1)", margin: "10px 0" }}
        />
        <div className="description">
          <div className="description_content">
            <div className="name">
              <h4>{value.name}</h4>
            </div>
            <div className="price" style={{ textAlign: "center" }}>
              <span>{value.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProductCardSpecial({ deviceDimensions }) {
  // استخدام المقاسات الديناميكية للخطوط
  const titleFontSize = deviceDimensions.isLargeScreen ? "1.3rem" : "1.2rem";
  const priceFontSize = deviceDimensions.isLargeScreen ? "1.4rem" : "1.3rem";
  const tagFontSize = deviceDimensions.isLargeScreen ? "1rem" : "0.95rem";

  return (
    <Link href="/prodect_detail" className="ProductCard_special">
      <div
        className="image"
        style={{
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <img style={{ height: "100%" }} src="/ph.jpg" alt="Placeholder" />
      </div>
      <hr
        style={{
          border: "1px solid rgba(0, 0, 0, 0.1)",
          margin: "0px 10px",
          width: "1px",
          height: "100%",
        }}
      />
      <div className="description">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "0px 5px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: titleFontSize,
                color: "#22223b",
              }}
            >
              Product Name
            </h2>
            <span
              style={{
                display: "inline-block",
                background: "#f1f5f9",
                color: "#3b3b3b",
                borderRadius: "8px",
                padding: "2px 10px",
                fontSize: tagFontSize,
              }}
            >
              Color: Blue
            </span>
          </div>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                background: "#f1f5f9",
                color: "#3b3b3b",
                borderRadius: "8px",
                padding: "0px 10px",
                fontSize: tagFontSize,
              }}
            >
              Size: M
            </span>
            <div
              style={{ fontWeight: 600, fontSize: "1.1rem", color: "#22223b" }}
            >
              <span style={{ color: "#2d6a4f", fontSize: priceFontSize }}>
                $80
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProductCardDiscount() {
  // استخدام المقاسات الديناميكية للخطوط
  return (
    <Link href="/prodect_detail" className="ProductCard_discount">
      <div
        style={{
          border: "1px solid rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <img src="/ph.jpg" alt="Placeholder" />
      </div>
      <hr
        style={{ border: "1px solid rgba(0, 0, 0, 0.1)", margin: "10px 0" }}
      />
      <div className="description">
        <div
          className="description-content"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "18px",
          }}
        >
          <div className="name_and_color">
            <h2>Product Name</h2>
            <span>Color: Blue</span>
          </div>
          <div className="size_and_price" style={{ textAlign: "right" }}>
            <span className="Size">Size: M</span>
            <div
              style={{ marginTop: "8px", fontWeight: 600, color: "#22223b" }}
            >
              <span className="old_price">$100</span>
              <span className="new_price">$80</span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <span className="discount">20% OFF</span>
            </div>
            <span className="discount-start">Start: 2023-01-01</span>
            <span className="discount-end">End: 2023-12-31</span>
          </div>
        </div>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
            height: "60px",
          }}
        >
          <button>
            Buy Now{" "}
            <span className="material-symbols-outlined">
              keyboard_double_arrow_right
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}

function Footer_content({ deviceDimensions, value }) {
  const footerFontSize = deviceDimensions.isLargeScreen ? "1.1rem" : "1rem";

  return (
    <div className="footer-content">
      <p style={{ fontSize: footerFontSize }}>Footer Content</p>
      <div className="footer-links">
        <ul style={{ fontSize: footerFontSize }}>
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </div>
  );
}
const Login = ({ setvalue, value, token }) => {
  const [data, setdata] = useState({
    username: "@Anonimo",
    password: "@A.123456",
  });
  const [form, setform] = useState({ Sign_up: "none", Sign_in: "flex" });
  const [wrong, setwrong] = useState({ color: "red", input: "" });
  const [confirm_password, setconfirm_password] = useState("");
  const { setmessge, setSeverity, setsnack, setloged } = Use_them();
  const handleClick = useCallback((msg, sev) => {
    setmessge(msg);
    setSeverity(sev);
    setsnack(true);
  }, []);
  const [Sign_up, setSign_up] = useState({
    first_name: "",
    last_name: "",
    phone_numbers: [],
    password: "",
    email: "",
    address_line: { wilaya: "0" },
  });
  const [warning, setwarning] = useState({ status: "", display: "none" });
  const [loding, setloding] = useState({
    value: false,
    hight: "356px",
    width: "247.5px",
  });
  const [wilaya, setwilaya] = useState("0");
  const router = useRouter();
  console.log(form, "*****");
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--in",
      form.Sign_in === "flex" ? "opacity_2" : "opacity_1"
    );
    document.documentElement.style.setProperty(
      "--login",
      form.Sign_in === "flex" || form.Sign_up === "grid" ? "opacity_2" : null
    );
    document.documentElement.style.setProperty(
      "--up",
      form.Sign_up === "grid" ? "opacity_2" : "opacity_1"
    );
    document.documentElement.style.setProperty("--in_display", form.Sign_in);
    document.documentElement.style.setProperty("--up_display", form.Sign_up);
  }, [form]);
  useEffect(() => {
    const default_account = async () => {
      await fetch(`http://${URL}:8000/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
    };
    if (!token) {
      localStorage.setItem("logeed", "false");
      default_account();
    }
  }, []);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setloding({ value: true, hight: "356px", width: "247.5px" });
      const res = await fetch(`http://${URL}:8000/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (res.status === 401) {
        setwarning({ status: "401", display: "flex" });
        handleClick("كلمة السر غير صحيحة اعد المحاولة ", "error");
      } else if (res.status === 500) {
        setwarning({ status: "500", display: "flex" });
        handleClick("إسم المستخدم خاطأ اعد المحاولة ", "error");
      } else {
        setvalue("none");
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
      handleClick("تم تسجيل الدخول", "success");
    } catch (error) {
      console.log("خطأفي أحد المعطيات", error);
      return;
    } finally {
      setloding({ value: false, hight: "356px", width: "247.5px" });
      window.location.reload();
      router.push("/profile");
    }
  };
  const handleregister = async (e) => {
    e.preventDefault();
    if (Sign_up.first_name.length < 3) {
      setwrong({ ...wrong, input: "first_name" });
    } else if (Sign_up.last_name.length < 3) {
      setwrong({ ...wrong, input: "last_name" });
    } else if (!Sign_up.email.endsWith("@gmail.com")) {
      setwrong({ ...wrong, input: "email" });
    } else if (!Sign_up.email.includes(".")) {
      setwrong({ ...wrong, input: "email" });
    } else if (Sign_up.password != confirm_password) {
      setwrong({ ...wrong, input: "password" });
    } else if (
      Sign_up.phone_numbers[0] &&
      !/^(05|06|07|02)\d{8}$/.test(Sign_up.phone_numbers[0])
    ) {
      setwrong({ ...wrong, input: "Phone1" });
    } else if (
      Sign_up.phone_numbers[1] &&
      !/^(05|06|07|02)\d{8}$/.test(Sign_up.phone_numbers[1])
    ) {
      setwrong({ ...wrong, input: "Phone2" });
    } else {
      setwrong({ ...wrong, input: "" });
      console.log(Sign_up, "55555555555");
      try {
        setloding({ value: true, hight: "524px", width: "350px" });
        const res = await fetch(`http://${URL}:8000/api/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Sign_up),
          credentials: "include",
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.log("Response from /api/auth:", errorData.error);
          setwarning({
            status: "400",
            display: "flex",
            message: errorData.error,
          });
          throw new Error(JSON.stringify(errorData));
        } else {
          try {
            const response = await res.json();
            const login = {
              username: response.username,
              password: Sign_up.password,
            };
            const log = await fetch(`http://${URL}:8000/api/token/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(login),
              credentials: "include",
            });
            if (!log.ok) {
              const errorData = await log.json();
              console.log("Response from /api/auth:", errorData.error, login);
              throw new Error(JSON.stringify(errorData));
            }
            setloged(true);
          } catch (error) {
            console.log("خطأفي أحد المعطيات", error);
          }
          setvalue("none");
        }
      } catch (error) {
        console.log("خطأفي أحد المعطيات", error);
      } finally {
        setloding({ value: false, hight: "356px", width: "247.5px" });
        setform({ Sign_in: "flex", Sign_up: "none" });
        router.push("/profile");
        window.location.reload();
      }
    }
  };
  return (
    <div className="login_contener" style={{ display: value }}>
      <div className="Form_contener">
        <div className="Btn_close">
          <button
            onClick={() => {
              setvalue("none");
              setform({ Sign_in: "flex", Sign_up: "none" });
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {loding.value === true ? (
          <div
            className="loading_contener"
            style={{ height: loding.hight, width: loding.width }}
          >
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <form className="Sign_in" onSubmit={handleSubmit}>
              <label>Name :</label>
              <input
                onChange={(e) => setdata({ ...data, username: e.target.value })}
                type="text"
                required
              />
              <label>Password :</label>
              <input
                onChange={(e) => setdata({ ...data, password: e.target.value })}
                type="password"
                required
              />
              <button>Go</button>
            </form>
            <form className="Sign_up" onSubmit={handleregister}>
              <div className="Ferst_Name">
                <label>Ferst Name :</label>
                <input
                  type="text"
                  value={Sign_up.first_name || ""}
                  onChange={(e) =>
                    setSign_up({ ...Sign_up, first_name: e.target.value })
                  }
                  style={{
                    borderColor:
                      wrong.input === "first_name" ? wrong.color : "black",
                  }}
                  required
                />
              </div>
              <div className="Last_Name">
                <label>Last Name :</label>
                <input
                  type="text"
                  value={Sign_up.last_name || ""}
                  onChange={(e) =>
                    setSign_up({ ...Sign_up, last_name: e.target.value })
                  }
                  style={{
                    borderColor:
                      wrong.input === "last_name" ? wrong.color : "black",
                  }}
                  required
                />
              </div>
              <div className="Email">
                <label>Email :</label>
                <input
                  type="email"
                  value={Sign_up.email || ""}
                  onChange={(e) =>
                    setSign_up({
                      ...Sign_up,
                      email: e.target.value.trim().toLowerCase(),
                    })
                  }
                  style={{
                    borderColor:
                      wrong.input === "email" ? wrong.color : "black",
                  }}
                  required
                />
              </div>
              <div className="Password">
                <label>Password :</label>
                <input
                  type="password"
                  value={Sign_up.password || ""}
                  onChange={(e) =>
                    setSign_up({ ...Sign_up, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="Check Password">
                <label>Check Password :</label>
                <input
                  type="password"
                  value={confirm_password || ""}
                  onChange={(e) => setconfirm_password(e.target.value)}
                  style={{
                    borderColor:
                      wrong.input === "password" ? wrong.color : "black",
                  }}
                  required
                />
              </div>
              <div className="wilaya">
                <label>Wilaya :</label>
                <select
                  value={wilaya}
                  onChange={(e) => {
                    setwilaya(e.target.value);
                    setSign_up({
                      ...Sign_up,
                      address_line: {
                        ...Sign_up.address_line,
                        wilaya: e.target.value,
                      },
                    });
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
              <div className="wilaya">
                <label>Baldya :</label>
                <select
                  value={Sign_up.address_line.baldya || ""}
                  disabled={wilaya === "0"}
                  onChange={(e) =>
                    setSign_up({
                      ...Sign_up,
                      address_line: {
                        ...Sign_up.address_line,
                        baldya: e.target.value,
                      },
                    })
                  }
                >
                  <option value="فارغ">-- اختر البلدية --</option>
                  {wilaya !== "0" &&
                    WILAYAS_DATA.find(
                      (w) => w.wilaya_name === wilaya
                    )?.communes?.map((commune, idx) => (
                      <option key={idx} value={commune.commune_name}>
                        {commune.commune_name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
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
                    Sign_up.phone_numbers && Sign_up.phone_numbers[0]
                      ? Sign_up.phone_numbers[0]
                      : ""
                  }
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                  }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setSign_up({
                      ...Sign_up,
                      phone_numbers: [
                        val,
                        ...(Sign_up.phone_numbers && Sign_up.phone_numbers[1]
                          ? [Sign_up.phone_numbers[1]]
                          : []),
                      ],
                    });
                  }}
                  maxLength={10}
                  required
                />
              </div>
              <div>
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
                    Sign_up.phone_numbers && Sign_up.phone_numbers[1]
                      ? Sign_up.phone_numbers[1]
                      : ""
                  }
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                  }}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setSign_up({
                      ...Sign_up,
                      phone_numbers: [
                        Sign_up.phone_numbers && Sign_up.phone_numbers[0]
                          ? Sign_up.phone_numbers[0]
                          : "",
                        val,
                      ],
                    });
                  }}
                  maxLength={10}
                />
              </div>
              <button>Registration</button>
            </form>
            <p>________or________</p>
            <div className="Accont">
              <button>
                <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_1x_rtl_r5.png" />
              </button>
            </div>
            <p className="method">
              {form.Sign_in === "flex"
                ? "If you do not have an account"
                : "If you have an account"}
              {form.Sign_in === "flex" ? (
                <a
                  href="#"
                  onClick={() => {
                    setform({ Sign_in: "none", Sign_up: "grid" });
                  }}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                >
                  Sign up
                </a>
              ) : (
                <a
                  href="#"
                  onClick={() => {
                    setform({ Sign_in: "flex", Sign_up: "none" });
                  }}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                >
                  Sign in
                </a>
              )}
            </p>
          </>
        )}
      </div>
      <div className="warning_contener" style={{ display: warning.display }}>
        <div className="warning">
          {warning.status === "401" ? (
            <h1>wrong password</h1>
          ) : warning.status === "500" ? (
            <h1>wrong username</h1>
          ) : (
            <h1>{warning.message}</h1>
          )}
          <div className="btn">
            <button onClick={() => setwarning({ status: "", display: "None" })}>
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export const Header = ({ token_access }) => {
  const [value, setvalue] = useState("none");
  if (typeof window !== "undefined") {
    console.log(window.innerWidth, ".......");
  }
  const deviceDimensions = useDeviceDimensions();
  const viewportSize = useViewportSize();
  // حساب المقاسات المثالية باستخدام الدوال المساعدة
  const optimalDimensions = calculateOptimalDimensions(deviceDimensions);
  const performanceSettings = getPerformanceSettings(deviceDimensions);
  // عرض معلومات الجهاز للتطوير (يمكن إزالته لاحقاً)
  useEffect(() => {
    console.log("Device Dimensions:", deviceDimensions);
    console.log("Viewport Size:", viewportSize);
    console.log("Optimal Dimensions:", optimalDimensions);
    console.log("Performance Settings:", performanceSettings);
  }, [deviceDimensions, viewportSize, optimalDimensions, performanceSettings]);
  return (
    <>
      <Header_content
        setvalue={setvalue}
        setIsMobile={() => {}}
        deviceDimensions={deviceDimensions}
        viewportSize={viewportSize}
      />
      <Login setvalue={setvalue} value={value} token={token_access} />
    </>
  );
};
export const Footer = () => {
  if (typeof window !== "undefined") {
    console.log(window.innerWidth, ".......");
  }
  const deviceDimensions = useDeviceDimensions();
  const viewportSize = useViewportSize();

  // حساب المقاسات المثالية باستخدام الدوال المساعدة
  const optimalDimensions = calculateOptimalDimensions(deviceDimensions);
  const performanceSettings = getPerformanceSettings(deviceDimensions);

  // عرض معلومات الجهاز للتطوير (يمكن إزالته لاحقاً)
  useEffect(() => {
    console.log("Device Dimensions:", deviceDimensions);
    console.log("Viewport Size:", viewportSize);
    console.log("Optimal Dimensions:", optimalDimensions);
    console.log("Performance Settings:", performanceSettings);
  }, [deviceDimensions, viewportSize, optimalDimensions, performanceSettings]);
  return <Footer_content deviceDimensions={deviceDimensions} />;
};
export const Settings = () => {
  if (typeof window !== "undefined") {
    console.log(window.innerWidth, ".......");
  }
  const deviceDimensions = useDeviceDimensions();
  const viewportSize = useViewportSize();

  // استخدام المقاسات الحقيقية للجهاز
  const isMobile = deviceDimensions.isMobile;
  const isTablet = deviceDimensions.isTablet;
  const isDesktop = deviceDimensions.isDesktop;
  const isLandscape = deviceDimensions.isLandscape;
  const isPortrait = deviceDimensions.isPortrait;

  // حساب المقاسات المثالية باستخدام الدوال المساعدة
  const optimalDimensions = calculateOptimalDimensions(deviceDimensions);
  const optimalSpacing = calculateOptimalSpacing(
    viewportSize.width,
    viewportSize.height
  );
  const optimalFontSizes = calculateOptimalFontSizes(
    viewportSize.width,
    viewportSize.height
  );
  const performanceSettings = getPerformanceSettings(deviceDimensions);

  // حساب عدد الأعمدة المثالي للشبكة
  const gridColumns = calculateOptimalGridColumns(
    viewportSize.width - optimalDimensions.sidebarWidth,
    optimalDimensions.cardMinWidth,
    optimalDimensions.cardMaxWidth
  );

  // عرض معلومات الجهاز للتطوير (يمكن إزالته لاحقاً)
  useEffect(() => {
    console.log("Device Dimensions:", deviceDimensions);
    console.log("Viewport Size:", viewportSize);
    console.log("Optimal Dimensions:", optimalDimensions);
    console.log("Performance Settings:", performanceSettings);
  }, [deviceDimensions, viewportSize, optimalDimensions, performanceSettings]);

  return (
    <>
      {/* عرض معلومات الجهاز للتطوير */}
      {process.env.NODE_ENV === "development" && viewportSize.width > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 1000,
            maxWidth: "300px",
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
          <div>
            Sidebar Width: {Math.round(optimalDimensions.sidebarWidth)}px
          </div>
          <div>Card Min: {Math.round(optimalDimensions.cardMinWidth)}px</div>
          <div>Performance: {performanceSettings.imageQuality}</div>
        </div>
      )}
    </>
  );
};

export const Snack_bar = () => {
  const { message, severity, snack, setsnack } = Use_them();
  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setsnack(false);
  }, []);
  return (
    <>
      <Snackbar open={snack} autoHideDuration={5000} onClose={handleClose}>
        <SnackbarAlert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </SnackbarAlert>
      </Snackbar>
    </>
  );
};
