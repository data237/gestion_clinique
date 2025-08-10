import React from 'react';
import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour gérer les valeurs d'affichage responsive
 */
export const useDisplayConfig = () => {
  const [displayConfig, setDisplayConfig] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    contentPadding: 24,
    gridGap: 12,
    zoneHeight: 'calc(100vh - 120px - 40px)',
    gapSmall: 8,
    gapMedium: 12,
    gapLarge: 16,
    gapXL: 24,
    gapXXL: 32
  });

  useEffect(() => {
    const updateDisplayConfig = () => {
      const width = window.innerWidth;
      
      if (width <= 480) {
        setDisplayConfig({
          isMobile: true,
          isTablet: false,
          isDesktop: false,
          contentPadding: 12,
          gridGap: 6,
          zoneHeight: 'calc(100vh - 120px - 80px)',
          gapSmall: 6,
          gapMedium: 8,
          gapLarge: 10,
          gapXL: 12,
          gapXXL: 16
        });
      } else if (width <= 768) {
        setDisplayConfig({
          isMobile: false,
          isTablet: true,
          isDesktop: false,
          contentPadding: 16,
          gridGap: 8,
          zoneHeight: 'calc(100vh - 120px - 60px)',
          gapSmall: 8,
          gapMedium: 10,
          gapLarge: 12,
          gapXL: 16,
          gapXXL: 24
        });
      } else if (width <= 1200) {
        setDisplayConfig({
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          contentPadding: 20,
          gridGap: 10,
          zoneHeight: 'calc(100vh - 120px - 40px)',
          gapSmall: 8,
          gapMedium: 12,
          gapLarge: 14,
          gapXL: 20,
          gapXXL: 28
        });
      } else {
        setDisplayConfig({
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          contentPadding: 24,
          gridGap: 12,
          zoneHeight: 'calc(100vh - 120px - 40px)',
          gapSmall: 8,
          gapMedium: 12,
          gapLarge: 16,
          gapXL: 24,
          gapXXL: 32
        });
      }
    };

    // Mise à jour initiale
    updateDisplayConfig();

    // Écouteur d'événement pour le redimensionnement
    window.addEventListener('resize', updateDisplayConfig);

    // Nettoyage
    return () => window.removeEventListener('resize', updateDisplayConfig);
  }, []);

  return displayConfig;
};

/**
 * Composant pour appliquer les styles d'affichage
 */
export const DisplayZone = ({ 
  children, 
  variant = 'default', 
  className = '', 
  style = {} 
}) => {
  const config = useDisplayConfig();
  
  const baseStyles = {
    height: config.zoneHeight,
    display: 'flex',
    flexDirection: 'column',
    gap: `${config.gridGap}px`,
    padding: `${config.contentPadding}px`,
    overflow: 'hidden',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const variantStyles = {
    default: {
      backgroundColor: '#f8f9fa'
    },
    dashboard: {
      backgroundColor: 'rgba(238, 238, 238, 1)'
    },
    secretaire: {
      backgroundColor: 'rgba(239, 239, 255, 1)',
      height: '70vh'
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...style
  };

  return (
    <div className={`display-zone display-zone-${variant} ${className}`} style={combinedStyles}>
      {children}
    </div>
  );
};

/**
 * Composant pour les espaces entre éléments
 */
export const Spacer = ({ size = 'medium', className = '' }) => {
  const config = useDisplayConfig();
  
  const spacerSizes = {
    small: config.gapSmall,
    medium: config.gapMedium,
    large: config.gapLarge,
    xl: config.gapXL,
    xxl: config.gapXXL
  };

  return (
    <div 
      className={`spacer spacer-${size} ${className}`}
      style={{ 
        height: `${spacerSizes[size]}px`,
        width: '100%'
      }}
    />
  );
};

/**
 * Hook pour obtenir les valeurs d'espacement
 */
export const useSpacing = () => {
  const config = useDisplayConfig();
  
  return {
    small: config.gapSmall,
    medium: config.gapMedium,
    large: config.gapLarge,
    xl: config.gapXL,
    xxl: config.gapXXL,
    contentPadding: config.contentPadding,
    gridGap: config.gridGap
  };
};

export default DisplayZone; 