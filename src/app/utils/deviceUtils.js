'use client';

export function calculateOptimalDimensions(deviceInfo) {
  const { width, height, devicePixelRatio, isMobile, isTablet, isDesktop } = deviceInfo;
  
  const baseDimensions = {
    mobile: {
      sidebarWidth: Math.min(width * 0.9, 300),
      cardMinWidth: Math.min(width * 0.4, 150),
      cardMaxWidth: Math.min(width * 0.8, 250),
      headerHeight: Math.min(height * 0.08, 60),
      spacing: Math.min(width * 0.02, 8),
      fontSize: Math.min(width * 0.04, 14)
    },
    tablet: {
      sidebarWidth: Math.min(width * 0.25, 280),
      cardMinWidth: Math.min(width * 0.2, 200),
      cardMaxWidth: Math.min(width * 0.3, 300),
      headerHeight: Math.min(height * 0.07, 70),
      spacing: Math.min(width * 0.015, 12),
      fontSize: Math.min(width * 0.035, 16)
    },
    desktop: {
      sidebarWidth: Math.min(width * 0.2, 320),
      cardMinWidth: Math.min(width * 0.18, 250),
      cardMaxWidth: Math.min(width * 0.25, 350),
      headerHeight: Math.min(height * 0.06, 80),
      spacing: Math.min(width * 0.012, 16),
      fontSize: Math.min(width * 0.03, 18)
    }
  };

  let deviceType = 'desktop';
  if (isMobile) deviceType = 'mobile';
  else if (isTablet) deviceType = 'tablet';

  const dimensions = baseDimensions[deviceType];
  const dpiMultiplier = Math.min(devicePixelRatio, 2);

  return {
    ...dimensions,

    deviceType,
    dpiMultiplier,
    aspectRatio: width / height,
    isLandscape: width > height,
    isPortrait: height > width
  };
}

export function calculateOptimalGridColumns(containerWidth, cardMinWidth, cardMaxWidth) {
  const optimalColumns = Math.floor(containerWidth / ((cardMinWidth + cardMaxWidth) / 2));
  return Math.max(1, Math.min(optimalColumns, 6));
}

export function calculateOptimalSpacing(containerWidth, containerHeight) {
  const baseSpacing = Math.min(containerWidth, containerHeight) * 0.02;
  return {
    xs: Math.max(4, baseSpacing * 0.5),
    sm: Math.max(8, baseSpacing),
    md: Math.max(16, baseSpacing * 1.5),
    lg: Math.max(24, baseSpacing * 2),
    xl: Math.max(32, baseSpacing * 2.5)
  };
}

export function calculateOptimalFontSizes(containerWidth, containerHeight) {
  const baseSize = Math.min(containerWidth, containerHeight) * 0.02;
  return {
    xs: Math.max(12, baseSize * 0.8),
    sm: Math.max(14, baseSize),
    base: Math.max(16, baseSize * 1.2),
    lg: Math.max(18, baseSize * 1.4),
    xl: Math.max(20, baseSize * 1.6),
    '2xl': Math.max(24, baseSize * 2)
  };
}

export function getPerformanceSettings(deviceInfo) {
  const { devicePixelRatio, width, height } = deviceInfo;
  
  if (devicePixelRatio >= 2 && width >= 1920) {
    return {
      enableAnimations: true,
      enableShadows: true,
      enableGradients: true,
      imageQuality: 'high',
      animationDuration: '0.3s',
      shadowIntensity: 'high'
    };
  } else if (devicePixelRatio >= 1.5 || width >= 1024) {
    return {
      enableAnimations: true,
      enableShadows: true,
      enableGradients: true,
      imageQuality: 'medium',
      animationDuration: '0.25s',
      shadowIntensity: 'medium'
    };
  } else {
    return {
      enableAnimations: false,
      enableShadows: false,
      enableGradients: false,
      imageQuality: 'low',
      animationDuration: '0s',
      shadowIntensity: 'none'
    };
  }
}


