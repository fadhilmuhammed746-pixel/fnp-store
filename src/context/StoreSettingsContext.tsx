import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '../types';
import { getStoreSettings, updateStoreSettings as saveSettings } from '../services/settingsService';
import { INITIAL_SETTINGS } from '../services/seedData';

interface StoreSettingsContextType {
  settings: StoreSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getStoreSettings();
      setSettings(data);
    } catch (err) {
      console.warn('Failed to load store settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = await saveSettings(newSettings);
    setSettings(updated);
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateSettings,
        refreshSettings: loadSettings
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) throw new Error('useStoreSettings must be used within StoreSettingsProvider');
  return context;
};
