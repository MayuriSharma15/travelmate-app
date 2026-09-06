import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true');
      } else {
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('darkMode', String(newTheme));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const theme = {
    dark: isDarkMode,
    colors: {
      // Backgrounds
      background: isDarkMode ? '#000000' : '#FFFFFF',
      card: isDarkMode ? '#1c1c1c' : '#F5F5F5',
      surface: isDarkMode ? '#2a2a2a' : '#EEEEEE',
      
      // Text
      text: isDarkMode ? '#FFFFFF' : '#000000',
      textSecondary: isDarkMode ? '#AAAAAA' : '#666666',
      textTertiary: isDarkMode ? '#888888' : '#999999',
      
      // Borders
      border: isDarkMode ? '#2a2a2a' : '#E0E0E0',
      divider: isDarkMode ? '#333333' : '#DDDDDD',
      
      // Interactive
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      
      // Status
      verified: '#4CAF50',
      unverified: '#FFA500',
      
      // Input
      inputBg: isDarkMode ? '#1c1c1c' : '#F8F8F8',
      inputBorder: isDarkMode ? '#333333' : '#E0E0E0',
      inputText: isDarkMode ? '#FFFFFF' : '#000000',
      placeholder: isDarkMode ? '#666666' : '#999999',
      
      // Special
      white: '#FFFFFF',
      black: '#000000',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};