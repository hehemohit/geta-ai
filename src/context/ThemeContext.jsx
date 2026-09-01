import React, { createContext, useContext, useState, useEffect } from 'react';

// Preset Cyberpunk & Neon Color Themes (Default: Electric Cobalt Cyan #06b6d4)
export const THEME_PRESETS = [
  {
    id: 'cyan',
    name: 'Electric Cobalt Cyan',
    hex: '#06b6d4',
    rgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.35)',
    description: 'Sci-fi holographic cobalt interface (Default)'
  },
  {
    id: 'crimson',
    name: 'Crimson Cyberpunk',
    hex: '#ef4444',
    rgb: '239, 68, 68',
    glow: 'rgba(239, 68, 68, 0.35)',
    description: 'High-contrast red tactical HUD'
  },
  {
    id: 'emerald',
    name: 'Matrix Cyber Green',
    hex: '#10b981',
    rgb: '16, 185, 129',
    glow: 'rgba(16, 185, 129, 0.35)',
    description: 'Neon terminal phosphor green'
  },
  {
    id: 'purple',
    name: 'Hyper Violet',
    hex: '#a855f7',
    rgb: '168, 85, 247',
    glow: 'rgba(168, 85, 247, 0.35)',
    description: 'Synthwave night city glow'
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    hex: '#f59e0b',
    rgb: '245, 158, 11',
    glow: 'rgba(245, 158, 11, 0.35)',
    description: 'Industrial warning gold'
  },
  {
    id: 'pink',
    name: 'Neon Magenta',
    hex: '#ec4899',
    rgb: '236, 72, 153',
    glow: 'rgba(236, 72, 153, 0.35)',
    description: 'Vibrant cyberpunk hot pink'
  },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('usersphere_theme') || 'cyan';
  });

  const [customHex, setCustomHex] = useState(() => {
    return localStorage.getItem('usersphere_custom_hex') || '#06b6d4';
  });

  const activePreset = THEME_PRESETS.find((p) => p.id === currentTheme) || {
    id: 'custom',
    name: 'Custom Calibration',
    hex: customHex,
    rgb: hexToRgb(customHex),
    glow: `rgba(${hexToRgb(customHex)}, 0.35)`,
    description: 'User-configured custom hex frequency'
  };

  // Convert Hex to RGB string 'r, g, b'
  function hexToRgb(hex) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map((x) => x + x).join('');
    }
    const num = parseInt(c, 16);
    if (isNaN(num)) return '6, 182, 212';
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }

  // Update CSS Variables on Root Document dynamically
  useEffect(() => {
    const root = document.documentElement;
    const activeHex = currentTheme === 'custom' ? customHex : (THEME_PRESETS.find(p => p.id === currentTheme)?.hex || '#06b6d4');
    const rgbStr = hexToRgb(activeHex);

    root.style.setProperty('--accent-hex', activeHex);
    root.style.setProperty('--accent-rgb', rgbStr);
    root.style.setProperty('--accent-glow', `rgba(${rgbStr}, 0.35)`);
    root.style.setProperty('--accent-bg-subtle', `rgba(${rgbStr}, 0.12)`);
    root.style.setProperty('--accent-border', `rgba(${rgbStr}, 0.5)`);

    localStorage.setItem('usersphere_theme', currentTheme);
    if (currentTheme === 'custom') {
      localStorage.setItem('usersphere_custom_hex', customHex);
    }
  }, [currentTheme, customHex]);

  const selectTheme = (themeId) => {
    setCurrentTheme(themeId);
  };

  const applyCustomHex = (hex) => {
    setCustomHex(hex);
    setCurrentTheme('custom');
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        activePreset,
        customHex,
        selectTheme,
        applyCustomHex,
        presets: THEME_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
