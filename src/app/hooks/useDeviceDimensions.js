"use client";
import { useState, useEffect } from "react";

export function useDeviceDimensions() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    devicePixelRatio: 1,
    orientation: "portrait",
    isLandscape: false,
    isPortrait: true,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLargeScreen: false,
    isExtraLargeScreen: false,
  });

  useEffect(() => {
    // التأكد من أننا في المتصفح
    if (typeof window === "undefined") return;

    function updateDimensions() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDimensions({
        width,
        height,
        devicePixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation?.type || "portrait",
        isLandscape: width > height,
        isPortrait: height > width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isLargeScreen: width >= 1440,
        isExtraLargeScreen: width >= 1920,
      });

      // تحديث CSS Custom Properties
    }

    // تحديث المقاسات عند التحميل
    updateDimensions();

    // مراقبة تغيير المقاسات
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("orientationchange", updateDimensions);

    // مراقبة تغيير DPI (مهم للأجهزة عالية الدقة)
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(resolution: 1dppx)");
      mediaQuery.addEventListener("change", updateDimensions);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia("(resolution: 1dppx)");
        mediaQuery.removeEventListener("change", updateDimensions);
      }
    };
  }, []);

  return dimensions;
}

export function useViewportSize() {
  const [viewportSize, setViewportSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // التأكد من أننا في المتصفح
    if (typeof window === "undefined") return;

    function updateViewportSize() {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    window.addEventListener("orientationchange", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
      window.removeEventListener("orientationchange", updateViewportSize);
    };
  }, []);

  return viewportSize;
}
