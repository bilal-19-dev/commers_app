'use client';
import React, { useEffect, useState, useContext } from 'react';
import Collapse from '@mui/material/Collapse';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDeviceDimensions, useViewportSize } from '../hooks/useDeviceDimensions';
import { 
  calculateOptimalDimensions, 
  calculateOptimalGridColumns, 
  calculateOptimalSpacing, 
  calculateOptimalFontSizes,
  getPerformanceSettings 
} from '../utils/deviceUtils';
import Link from "next/link"
import Cookies from 'js-cookie';
import path from 'path';

export default function Home_component({data}) {
  const prodect = data
  if (typeof window !== 'undefined') {
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
  const optimalSpacing = calculateOptimalSpacing(viewportSize.width, viewportSize.height);
  const optimalFontSizes = calculateOptimalFontSizes(viewportSize.width, viewportSize.height);
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
        <div className='prodect-container'>
          <section className="sidebar">
            <Sidebar 
              isMobile={isMobile} 
              setIsMobile={() => {}} 
              deviceDimensions={deviceDimensions}
            />
          </section>
          <section className='middle'>
            <div className='container'>
              {prodect.map(item => {
                console.log(item, "-*-****");
                return <ProductCard key={item.id} deviceDimensions={deviceDimensions} value={item}  />;
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


function Header_content({setvalue,deviceDimensions, viewportSize }){
  const [open, setOpen] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

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

  // استخدام المقاسات الديناميكية
  const searchWidth = deviceDimensions.isMobile ? 
    Math.min(275, (viewportSize.width || 1200) * 0.7) : 
    Math.min(550, (viewportSize.width || 1200) * 0.4);
  return (
    <header>
      <nav>
        <div className="nav-container">
          <div className='logo'>
            <h1 style={{ fontSize: '1.2rem' }}>Logo</h1>
          </div>
          <div className='content'>
            <div className='search-bar'>
              <input 
                className='search-input'
                type="search" 
                placeholder="Search..." 
              />
              <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: '1.2rem' }}>
                  search
                </span>
              </button>
            </div>
          </div>
          {viewportSize.width <= 760 ? (
            <div className='nav-links'>
              <>
                <Link href="/car">
                  <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: '2rem' }}>
                      shopping_cart_checkout
                    </span><span style={{ marginLeft: '5px' }}>0</span>
                  </button>
                </Link>
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                  <span className="material-symbols-outlined" onClick={handleClicklang} style={{ color: '#3b82f6', fontSize: '2rem' }}> 
                    translate
                  </span>
                </button>
                <button
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
                  onClick={handleClickMenu}
                >
                  <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: viewportSize.width <= 320 ? '1.2rem' : '1.5rem' }}>
                    menu
                  </span>
                </button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <Link href="/" passHref legacyBehavior>
                    <MenuItem onClick={handleClose} component="a">Home</MenuItem>
                  </Link>
                  <Link href="/orders" passHref legacyBehavior>
                    <MenuItem onClick={handleClose} component="a">Orders</MenuItem>
                  </Link>
                  <Link href="/profile">
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  </Link>
                  <MenuItem onClick={() => { handleClose(); setvalue('flex'); }}>Login</MenuItem>
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
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: '2rem' }}>
                      shopping_cart_checkout
                  </span><span style={{ marginLeft: '5px' }}>0</span>                </button>
              </Link>
              <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                <span className="material-symbols-outlined" onClick={handleClicklang} style={{ color: '#3b82f6', fontSize: '2rem' }}> 
                translate
                </span>
              </button>
              <button
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
                onClick={handleClickMenu}
              >
                  <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: viewportSize.width <= 320 ? '1.2rem' : '1.5rem' }}>
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
                <MenuItem onClick={() => { handleClose(); setvalue('flex'); }}>Login</MenuItem>
              </Menu>
              <Menu
                anchorEl={open}
                open={open}
                onClose={handleClose}
              >
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
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setIsMobile]);
  
  const [Collapsed, setCollapsed] = useState(true);
  const handleToggle = () => {
    setCollapsed(!Collapsed);
  };

  // استخدام المقاسات الديناميكية للخطوط
  const titleFontSize = (deviceDimensions.isLargeScreen && deviceDimensions.width > 0) ? '1.7rem' : '1.5rem';
  const filterFontSize = (deviceDimensions.isLargeScreen && deviceDimensions.width > 0) ? '1.1rem' : '1rem';
  const buttonFontSize = (deviceDimensions.isLargeScreen && deviceDimensions.width > 0) ? '1.2rem' : '1.1rem';

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
              textAlign: "center"
            }}
          >
            <span role="img" aria-label="filter" style={{marginRight: 8}}>🧲</span>
            الفلاتر
          </h2>
          {/* Price Range */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>نطاق السعر</div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="radio" name="priceRange" value="10-100" style={{accentColor: "#2d6a4f"}} />
                10 - 100 ريال
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="radio" name="priceRange" value="100-500" style={{accentColor: "#2d6a4f"}} />
                100 - 500 ريال
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="radio" name="priceRange" value="500-1000" style={{accentColor: "#2d6a4f"}} />
                500 - 1000 ريال
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="radio" name="priceRange" value="1000+" style={{accentColor: "#2d6a4f"}} />
                أكثر من 1000 ريال
              </label>
            </div>
          </div>
          {/* Category */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>الفئة</div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="category" value="category1" style={{accentColor: "#3b82f6"}} />
                إلكترونيات
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="category" value="category2" style={{accentColor: "#3b82f6"}} />
                ملابس
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="category" value="category3" style={{accentColor: "#3b82f6"}} />
                أجهزة منزلية
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="category" value="category4" style={{accentColor: "#3b82f6"}} />
                أخرى
              </label>
            </div>
          </div>
          {/* Brand */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>الماركة</div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="brand" value="brand1" style={{accentColor: "#f59e42"}} />
                سامسونج
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="brand" value="brand2" style={{accentColor: "#f59e42"}} />
                أبل
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="brand" value="brand3" style={{accentColor: "#f59e42"}} />
                هواوي
              </label>
            </div>
          </div>
          {/* Availability */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>التوفر</div>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: filterFontSize,
                background: "#fff",
                color: "#22223b"
              }}
            >
              <option value="all">الكل</option>
              <option value="in-stock">متوفر</option>
              <option value="out-of-stock">غير متوفر</option>
            </select>
          </div>
          {/* Rating */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>التقييم</div>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: filterFontSize,
                background: "#fff",
                color: "#22223b"
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
          <div className="filter" style={{marginBottom: "10px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>الخصائص</div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="attribute" value="attribute1" style={{accentColor: "#a21caf"}} />
                جديد
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="attribute" value="attribute2" style={{accentColor: "#a21caf"}} />
                الأكثر مبيعاً
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="attribute" value="attribute3" style={{accentColor: "#a21caf"}} />
                شحن مجاني
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="attribute" value="attribute4" style={{accentColor: "#a21caf"}} />
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
              transition: "background 0.2s"
            }}
          >
            <span role="img" aria-label="search" style={{marginLeft: 8}}>🔎</span>
            تطبيق الفلاتر
          </button>
        </div>
    );

  }else {
    return (
      <Collapse in={Collapsed} collapsedSize={50} className="sidebar-content" style={{}}>
        <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px"}}>
          <h2
              style={{
                fontSize: titleFontSize,
              fontWeight: 800,
              marginBottom: "24px",
              letterSpacing: "0.5px",
              color: "#3b3b3b",
              textAlign: "center"
            }}
          >
            <span role="img" aria-label="filter" style={{marginRight: 8}}>🧲</span>
            الفلاتر
          </h2>
          <button className='filter-button' onClick={handleToggle} style={{rotate : open ? '180deg' : '0deg', background: 'transparent', border: 'none', cursor: 'pointer'}}>
            <span className="material-symbols-outlined">
              arrow_drop_down
            </span>
          </button>
        </div>
        <div style={{width: "100%" , height: "calc(100vh - 150px)", overflowY: "auto", padding: "0 10px"}}>
          {/* Price Range */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>نطاق السعر</div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="radio" name="priceRange" value="10-100" style={{accentColor: "#2d6a4f"}} />
                10 - 100 ريال
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="radio" name="priceRange" value="100-500" style={{accentColor: "#2d6a4f"}} />
                100 - 500 ريال
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="radio" name="priceRange" value="500-1000" style={{accentColor: "#2d6a4f"}} />
                500 - 1000 ريال
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="radio" name="priceRange" value="1000+" style={{accentColor: "#2d6a4f"}} />
                أكثر من 1000 ريال
              </label>
            </div>
          </div>
          {/* Category */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>الفئة</div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="category" value="category1" style={{accentColor: "#3b82f6"}} />
                إلكترونيات
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="category" value="category2" style={{accentColor: "#3b82f6"}} />
                ملابس
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="category" value="category3" style={{accentColor: "#3b82f6"}} />
                أجهزة منزلية
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="category" value="category4" style={{accentColor: "#3b82f6"}} />
                أخرى
              </label>
            </div>
          </div>
          {/* Brand */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>الماركة</div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="brand" value="brand1" style={{accentColor: "#f59e42"}} />
                سامسونج
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="brand" value="brand2" style={{accentColor: "#f59e42"}} />
                أبل
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="brand" value="brand3" style={{accentColor: "#f59e42"}} />
                هواوي
              </label>
            </div>
          </div>
          {/* Availability */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>التوفر</div>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: filterFontSize,
                background: "#fff",
                color: "#22223b"
              }}
            >
              <option value="all">الكل</option>
              <option value="in-stock">متوفر</option>
              <option value="out-of-stock">غير متوفر</option>
            </select>
          </div>
          {/* Rating */}
          <div className="filter" style={{marginBottom: "22px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>التقييم</div>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: filterFontSize,
                background: "#fff",
                color: "#22223b"
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
          <div className="filter" style={{marginBottom: "10px"}}>
            <div style={{fontWeight: 700, marginBottom: "10px", color: "#2d6a4f", fontSize: filterFontSize}}>الخصائص</div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="attribute" value="attribute1" style={{accentColor: "#a21caf"}} />
                جديد
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="attribute" value="attribute2" style={{accentColor: "#a21caf"}} />
                الأكثر مبيعاً
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="attribute" value="attribute3" style={{accentColor: "#a21caf"}} />
                شحن مجاني
              </label>
              <label style={{display: "flex", alignItems: "center", gap: "8px", fontSize: filterFontSize}}>
                <input type="checkbox" name="attribute" value="attribute4" style={{accentColor: "#a21caf"}} />
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
              transition: "background 0.2s"
            }}
          >
            <span role="img" aria-label="search" style={{marginLeft: 8}}>🔎</span>
            تطبيق الفلاتر
          </button>
        </div>
      </Collapse>
    );
  }
}

function ProductCard({ value }) {
  const primaryImage = value.images.find(img => img.TypeIs === "Primary");
  return (
    <Link href={`/prodect_detail/${value.id}`}>
      <div className='ProductCard'>
        <div className='image'>
          <img src={primaryImage.image !== undefined ? primaryImage.image: "/ph.jpg" } alt="Placeholder" />
        </div>
        <hr style={{ border: '1px solid rgba(0, 0, 0, 0.1)', margin: '10px 0' }} />
        <div className='description'>
          <div className='description_content'>
            <div className='name'>
              <h4>{value.name}</h4>
            </div>
            <div className='price' style={{ textAlign: 'center' }}>
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
  const titleFontSize = deviceDimensions.isLargeScreen ? '1.3rem' : '1.2rem';
  const priceFontSize = deviceDimensions.isLargeScreen ? '1.4rem' : '1.3rem';
  const tagFontSize = deviceDimensions.isLargeScreen ? '1rem' : '0.95rem';

  return (
    <Link href="/prodect_detail" className='ProductCard_special'>
        <div className="image" style={{ border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '15px', overflow: 'hidden'}}>
          <img style={{ height: '100%' }} src="/ph.jpg" alt="Placeholder" />
        </div>
        <hr style={{ border: '1px solid rgba(0, 0, 0, 0.1)', margin: '0px 10px', width: '1px', height: '100%' }} />
        <div className='description'>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '0px 5px',
              }}>
                <div>
                  <h2 style={{ margin: 0, fontWeight: 700, fontSize: titleFontSize, color: '#22223b' }}>Product Name</h2>
                  <span style={{
                    display: 'inline-block',
                    background: '#f1f5f9',
                    color: '#3b3b3b',
                    borderRadius: '8px',
                    padding: '2px 10px',
                    fontSize: tagFontSize,
                  }}>Color: Blue</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#f1f5f9',
                    color: '#3b3b3b',
                    borderRadius: '8px',
                    padding: '0px 10px',
                    fontSize: tagFontSize
                  }}>Size: M</span>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#22223b' }}>
                    <span style={{ color: '#2d6a4f', fontSize: priceFontSize }}>$80</span>
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
    <Link href="/prodect_detail" className='ProductCard_discount' >
        <div style={{ border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '15px', overflow: 'hidden'}}>
          <img src="/ph.jpg" alt="Placeholder" />
        </div>
        <hr style={{ border: '1px solid rgba(0, 0, 0, 0.1)', margin: '10px 0' }} />
        <div className="description">
          <div className='description-content' style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '18px'
          }}>
            <div className='name_and_color'>
              <h2>Product Name</h2>
              <span>Color: Blue</span>
            </div>
            <div className='size_and_price' style={{ textAlign: 'right' }}>
              <span className='Size'>Size: M</span>
              <div style={{ marginTop: '8px', fontWeight: 600, color: '#22223b' }}>
                <span className='old_price' >$100</span>
                <span className='new_price'>$80</span>
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex' ,
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center', 
            marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', gap: '8px' ,flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div>
                <span className='discount'>20% OFF</span>
              </div>
              <span className='discount-start'>Start: 2023-01-01</span>
              <span className='discount-end'>End: 2023-12-31</span>
            </div>
          </div>
          <div style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'end',
            height: '60px',
          }}>
            <button>Buy Now <span className="material-symbols-outlined">
                keyboard_double_arrow_right
                </span>
            </button>
          </div>
        </div>
    </Link>
  );
}

function Footer_content({ deviceDimensions ,value }) {
  const footerFontSize = deviceDimensions.isLargeScreen ? '1.1rem' : '1rem';
  
  return (
    <div className='footer-content'>
      <p style={{ fontSize: footerFontSize }}>Footer Content</p>
      <div className='footer-links'>
        <ul style={{ fontSize: footerFontSize }}>
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </div>
  );
}
const Login = ({ setvalue, value }) => {
  const [data, setdata] = useState({ username: '', password: '' });
  const [form, setform] = useState({Sign_up : 'none', Sign_in : 'flex'})
  console.log(form , "*****")
  useEffect(() => {
    document.documentElement.style.setProperty("--in", form.Sign_in === "flex" ? "opacity_2" : "opacity_1");
    document.documentElement.style.setProperty("--login", form.Sign_in === "flex" || form.Sign_up === "flex" ? "opacity_2" : null);
    document.documentElement.style.setProperty("--up", form.Sign_up === "flex" ? "opacity_2" : "opacity_1");
    document.documentElement.style.setProperty("--in_display", form.Sign_in);
    document.documentElement.style.setProperty("--up_display", form.Sign_up);
  }, [form]);
  const handleSubmit = async (e) => {
    const res = await fetch('http://192.168.1.192:3000/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    cache: "no-store"
  });

  // الرد من Route Handler (يمكن أن يحتوي بيانات أخرى إذا أردت)
    const responseData = await res.json();
    console.log("Response from /api/auth:", responseData);
    e.preventDefault()
    Cookies.set('Loged_in', JSON.stringify(true), { expires: 1/1440});
    window.location.reload();
  };
  return (
    <div className="login_contener" style={{display : value}}>
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
        <form className='Sign_in' onSubmit={handleSubmit} >
          <label>Name :</label>
          <input onChange={ e => setdata({...data , username : e.target.value })} type="text" />
          <label>Password :</label>
          <input onChange={ e => setdata({...data , password : e.target.value })} type="password" />
          <button>Go</button>
        </form>
        <form className='Sign_up'>
            <label>Full Name :</label>
            <input type="text" />
            <label>Email :</label>
            <input type="email" />
            <label>Password :</label>
            <input type="password" />
            <label>Check Password :</label>
            <input type="password" />
            <button>Registration</button>
          </form>
        <p>________or________</p>
        <div className="Accont">
          <button>
            <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_dark_1x_rtl_r5.png" />
          </button>
        </div>
        <p className="method">
          {form.Sign_in === "flex" ? "If you do not have an account" : "If you have an account" }
          { form.Sign_in === "flex" ? 
            <a
              href="#"
              onClick={() => {
                setform({Sign_in : "none" , Sign_up: "flex" });
                
              }}
              style={{ cursor: "pointer", marginLeft: "5px" }}
            >
              Sign up
            </a>
            :
            <a
              href="#"
              onClick={() => {
                setform({Sign_in : "flex" , Sign_up: "none"});
                
              }}
              style={{ cursor: "pointer", marginLeft: "5px" }}
            >
              Sign in
            </a>
          }
        </p>
        </div>
    </div>
  );
};
export const Header = () => {
  const [value, setvalue] = useState('none')
  if (typeof window !== 'undefined') {
    console.log(window.innerWidth, ".......");
  }
  const deviceDimensions = useDeviceDimensions();
  const viewportSize = useViewportSize();
  
  // حساب المقاسات المثالية باستخدام الدوال المساعدة
  const optimalDimensions = calculateOptimalDimensions(deviceDimensions);
  const performanceSettings = getPerformanceSettings(deviceDimensions);
  // عرض معلومات الجهاز للتطوير (يمكن إزالته لاحقاً)
  useEffect(() => {
    console.log('Device Dimensions:', deviceDimensions);
    console.log('Viewport Size:', viewportSize);
    console.log('Optimal Dimensions:', optimalDimensions);
    console.log('Performance Settings:', performanceSettings);
  }, [deviceDimensions, viewportSize, optimalDimensions, performanceSettings]);
  return (
    <>
      <Header_content setvalue={setvalue} setIsMobile={() => {}} deviceDimensions={deviceDimensions} viewportSize={viewportSize}/>
      <Login setvalue={setvalue} value={value}/>
    </>
)};
export const Footer = () => {
  if (typeof window !== 'undefined') {
    console.log(window.innerWidth, ".......");
  }
  const deviceDimensions = useDeviceDimensions();
  const viewportSize = useViewportSize();
  
  // حساب المقاسات المثالية باستخدام الدوال المساعدة
  const optimalDimensions = calculateOptimalDimensions(deviceDimensions);
  const performanceSettings = getPerformanceSettings(deviceDimensions);

  // عرض معلومات الجهاز للتطوير (يمكن إزالته لاحقاً)
  useEffect(() => {
    console.log('Device Dimensions:', deviceDimensions);
    console.log('Viewport Size:', viewportSize);
    console.log('Optimal Dimensions:', optimalDimensions);
    console.log('Performance Settings:', performanceSettings);
  }, [deviceDimensions, viewportSize, optimalDimensions, performanceSettings]);
  return (
    <Footer_content deviceDimensions={deviceDimensions} />
)};
export const Settings = () => {
  if (typeof window !== 'undefined') {
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
  const optimalSpacing = calculateOptimalSpacing(viewportSize.width, viewportSize.height);
  const optimalFontSizes = calculateOptimalFontSizes(viewportSize.width, viewportSize.height);
  const performanceSettings = getPerformanceSettings(deviceDimensions);
  
  // حساب عدد الأعمدة المثالي للشبكة
  const gridColumns = calculateOptimalGridColumns(
    viewportSize.width - optimalDimensions.sidebarWidth, 
    optimalDimensions.cardMinWidth, 
    optimalDimensions.cardMaxWidth
  );
  
  // عرض معلومات الجهاز للتطوير (يمكن إزالته لاحقاً)
  useEffect(() => {
    console.log('Device Dimensions:', deviceDimensions);
    console.log('Viewport Size:', viewportSize);
    console.log('Optimal Dimensions:', optimalDimensions);
    console.log('Performance Settings:', performanceSettings);
  }, [deviceDimensions, viewportSize, optimalDimensions, performanceSettings]);

  return (
    <>
      {/* عرض معلومات الجهاز للتطوير */}
      {process.env.NODE_ENV === 'development' && viewportSize.width > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 1000,
          maxWidth: '300px'
        }}>
          <div>Width: {viewportSize.width}px</div>
          <div>Height: {viewportSize.height}px</div>
          <div>Device: {deviceDimensions.isMobile ? 'Mobile' : deviceDimensions.isTablet ? 'Tablet' : 'Desktop'}</div>
          <div>Orientation: {deviceDimensions.orientation}</div>
          <div>Pixel Ratio: {deviceDimensions.devicePixelRatio}</div>
          <div>Grid Columns: {gridColumns}</div>
          <div>Sidebar Width: {Math.round(optimalDimensions.sidebarWidth)}px</div>
          <div>Card Min: {Math.round(optimalDimensions.cardMinWidth)}px</div>
          <div>Performance: {performanceSettings.imageQuality}</div>
        </div>
      )}
    </>
  )
} 