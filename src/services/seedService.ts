import { doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SETTINGS } from './seedData';

export const seedDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // 1. Seed to localStorage
    localStorage.setItem('fnp_products_v1', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('fnp_categories_v1', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('fnp_store_settings_v1', JSON.stringify(INITIAL_SETTINGS));

    // 2. If Firebase is configured, seed to Firestore
    if (isFirebaseConfigured && db) {
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      await setDoc(doc(db, 'storeSettings', 'global'), INITIAL_SETTINGS);
      return { success: true, message: 'Database successfully seeded to Cloud Firestore and local cache!' };
    }

    return { success: true, message: 'Sample catalog seeded to local storage! (Connect Firebase in .env to sync with Firestore)' };
  } catch (err: any) {
    console.error('Seed error:', err);
    return { success: false, message: err?.message || 'Failed to seed database' };
  }
};
