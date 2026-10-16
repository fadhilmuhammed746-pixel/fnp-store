import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Category } from '../types';
import { INITIAL_CATEGORIES } from './seedData';

const LOCAL_STORAGE_KEY = 'fnp_categories_v1';

const getLocalCategories = (): Category[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CATEGORIES;
  }
};

const saveLocalCategories = (categories: Category[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
};

export const getCategories = async (): Promise<Category[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
      }
    } catch (err) {
      console.warn('Firestore categories query failed, using local fallback:', err);
    }
  }
  return getLocalCategories();
};

export const createCategory = async (catData: Omit<Category, 'id'>): Promise<Category> => {
  const id = 'cat-' + Date.now();
  const newCat: Category = { ...catData, id };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'categories', id), newCat);
    } catch (err) {
      console.error('Firestore createCategory error:', err);
    }
  }

  const local = getLocalCategories();
  local.push(newCat);
  saveLocalCategories(local);
  return newCat;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'categories', id), updates);
    } catch (err) {
      console.error('Firestore updateCategory error:', err);
    }
  }

  const local = getLocalCategories();
  const index = local.findIndex(c => c.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], ...updates };
    saveLocalCategories(local);
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      console.error('Firestore deleteCategory error:', err);
    }
  }

  const local = getLocalCategories();
  const updated = local.filter(c => c.id !== id);
  saveLocalCategories(updated);
};
