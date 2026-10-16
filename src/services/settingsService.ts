import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { StoreSettings } from '../types';
import { INITIAL_SETTINGS } from './seedData';

const LOCAL_STORAGE_KEY = 'fnp_store_settings_v1';

const getLocalSettings = (): StoreSettings => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_SETTINGS;
  }
};

const saveLocalSettings = (settings: StoreSettings) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
};

export const getStoreSettings = async (): Promise<StoreSettings> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'storeSettings', 'global'));
      if (snap.exists()) {
        return snap.data() as StoreSettings;
      }
    } catch (err) {
      console.warn('Firestore settings fetch failed:', err);
    }
  }
  return getLocalSettings();
};

export const updateStoreSettings = async (settings: Partial<StoreSettings>): Promise<StoreSettings> => {
  const current = await getStoreSettings();
  const merged: StoreSettings = { ...current, ...settings };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'storeSettings', 'global'), merged, { merge: true });
    } catch (err) {
      console.error('Firestore settings update error:', err);
    }
  }

  saveLocalSettings(merged);
  return merged;
};
