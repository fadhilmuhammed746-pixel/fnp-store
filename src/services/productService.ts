import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from './seedData';

const LOCAL_STORAGE_KEY = 'fnp_products_v1';

const getLocalProducts = (): Product[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_PRODUCTS;
  }
};

const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};

export const getProducts = async (): Promise<Product[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      }
    } catch (err) {
      console.warn('Firestore fetch failed, falling back to local store:', err);
    }
  }
  return getLocalProducts();
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'products'), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
    } catch (err) {
      console.warn('Firestore getProductBySlug failed:', err);
    }
  }
  const local = getLocalProducts();
  return local.find(p => p.slug === slug) || null;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'products', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Product;
      }
    } catch (err) {
      console.warn('Firestore getProductById failed:', err);
    }
  }
  const local = getLocalProducts();
  return local.find(p => p.id === id) || null;
};

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const id = 'prod-' + Date.now();
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...productData,
    id,
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (err) {
      console.error('Firestore createProduct failed:', err);
    }
  }

  const local = getLocalProducts();
  local.unshift(newProduct);
  saveLocalProducts(local);
  return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  const now = new Date().toISOString();
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'products', id), {
        ...updates,
        updatedAt: now
      });
    } catch (err) {
      console.error('Firestore updateProduct failed:', err);
    }
  }

  const local = getLocalProducts();
  const index = local.findIndex(p => p.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], ...updates, updatedAt: now };
    saveLocalProducts(local);
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error('Firestore deleteProduct failed:', err);
    }
  }

  const local = getLocalProducts();
  const updated = local.filter(p => p.id !== id);
  saveLocalProducts(updated);
};
