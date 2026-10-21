import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Website, WebsiteCategory } from '../types';

const WEBSITE_KEY = 'fnp_webhub_websites_v1';
const CATEGORY_KEY = 'fnp_webhub_categories_v1';

const DEFAULT_CATEGORIES: WebsiteCategory[] = [
  { id: 'ai-tools', name: 'AI Tools', slug: 'ai-tools', description: 'AI-powered tools and products', color: '#3478F6', order: 1 },
  { id: 'education', name: 'Education', slug: 'education', description: 'Learning projects and educational platforms', color: '#22C55E', order: 2 },
  { id: 'web-apps', name: 'Web Applications', slug: 'web-apps', description: 'Web apps and SaaS-style products', color: '#8B5CF6', order: 3 },
  { id: 'games', name: 'Games', slug: 'games', description: 'Playful interactive experiences', color: '#F59E0B', order: 4 },
  { id: 'design-tools', name: 'Design Tools', slug: 'design-tools', description: 'Design and creative systems', color: '#EC4899', order: 5 },
  { id: 'portfolio', name: 'Portfolio', slug: 'portfolio', description: 'Personal brand and portfolio sites', color: '#0EA5E9', order: 6 },
  { id: 'other', name: 'Other', slug: 'other', description: 'Miscellaneous experiments', color: '#94A3B8', order: 7 },
];

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = <T,>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';

export const getDefaultWebsiteThumbnail = (name: string) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'FN';

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0B1F33&color=F8FAFC&size=600&rounded=true`;
};

export const getWebsiteCategories = async (): Promise<WebsiteCategory[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(query(collection(db, 'websiteCategories'), orderBy('order', 'asc')));
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as WebsiteCategory));
      }
    } catch (error) {
      console.warn('Firebase category fetch failed, using local storage fallback:', error);
    }
  }

  const categories = readJson<WebsiteCategory[] | null>(CATEGORY_KEY, null);
  if (!categories || categories.length === 0) {
    writeJson(CATEGORY_KEY, DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }
  return categories;
};

export const createWebsiteCategory = async (data: { name: string; description?: string }): Promise<WebsiteCategory> => {
  const name = data.name.trim();
  const categories = await getWebsiteCategories();
  if (!name) throw new Error('Category name is required.');
  if (categories.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('A category with this name already exists.');
  }

  const nextCategory: WebsiteCategory = {
    id: `cat-${Date.now()}`,
    name,
    slug: slugify(name),
    description: data.description?.trim() || '',
    color: '#3478F6',
    order: categories.length + 1,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'websiteCategories', nextCategory.id), nextCategory);
      return nextCategory;
    } catch (error) {
      console.warn('Firebase category create failed, falling back to local storage:', error);
    }
  }

  const updated = [...categories, nextCategory];
  writeJson(CATEGORY_KEY, updated);
  return nextCategory;
};

export const updateWebsiteCategory = async (id: string, updates: Partial<WebsiteCategory>): Promise<WebsiteCategory> => {
  const categories = await getWebsiteCategories();
  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) throw new Error('Category not found.');

  const current = categories[index];
  const nextData: WebsiteCategory = {
    ...current,
    ...updates,
    name: (updates.name ?? current.name).trim(),
    slug: slugify(updates.name ?? current.name),
    description: updates.description ?? current.description,
    color: updates.color ?? current.color,
    order: updates.order ?? current.order,
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'websiteCategories', id), nextData);
      return nextData;
    } catch (error) {
      console.warn('Firebase category update failed, falling back to local storage:', error);
    }
  }

  const updated = [...categories];
  updated[index] = nextData;
  writeJson(CATEGORY_KEY, updated);
  return nextData;
};

export const deleteWebsiteCategory = async (id: string): Promise<void> => {
  const categories = await getWebsiteCategories();
  const fallback = categories.find((category) => category.slug === 'other') ?? DEFAULT_CATEGORIES[6];
  const websites = await getWebsites();

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'websiteCategories', id));
    } catch (error) {
      console.warn('Firebase category delete failed:', error);
    }
  }

  const nextCategories = categories.filter((category) => category.id !== id);
  const nextWebsites = websites.map((website) =>
    website.categoryId === id
      ? { ...website, categoryId: fallback.id, category: fallback.name, updatedAt: new Date().toISOString() }
      : website
  );

  writeJson(CATEGORY_KEY, nextCategories.length > 0 ? nextCategories : DEFAULT_CATEGORIES);
  writeJson(WEBSITE_KEY, nextWebsites);
};

export const getWebsites = async (): Promise<Website[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(query(collection(db, 'websites'), orderBy('createdAt', 'desc')));
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Website));
      }
    } catch (error) {
      console.warn('Firebase websites fetch failed, using local storage fallback:', error);
    }
  }

  const websites = readJson<Website[] | null>(WEBSITE_KEY, null);
  if (!websites) {
    writeJson(WEBSITE_KEY, []);
    return [];
  }
  return websites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getFeaturedWebsites = async (): Promise<Website[]> => {
  const websites = await getWebsites();
  return websites.filter((website) => website.featured).slice(0, 6);
};

export const getWebsiteById = async (id: string): Promise<Website | null> => {
  const websites = await getWebsites();
  return websites.find((website) => website.id === id) ?? null;
};

export const createWebsite = async (input: Omit<Website, 'id' | 'createdAt' | 'updatedAt'>): Promise<Website> => {
  const name = input.name.trim();
  if (!name) throw new Error('Website name is required.');

  const url = input.url.trim();
  if (!/^https?:\/\//i.test(url)) {
    throw new Error('Please provide a valid website URL starting with http:// or https://');
  }

  const now = new Date().toISOString();
  const nextWebsite: Website = {
    ...input,
    id: `site-${Date.now()}`,
    name,
    url,
    description: input.description.trim(),
    thumbnail: input.thumbnail.trim() || getDefaultWebsiteThumbnail(name),
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'websites', nextWebsite.id), nextWebsite);
      return nextWebsite;
    } catch (error) {
      console.warn('Firebase website create failed, falling back to local storage:', error);
    }
  }

  const current = await getWebsites();
  writeJson(WEBSITE_KEY, [nextWebsite, ...current]);
  return nextWebsite;
};

export const updateWebsite = async (id: string, updates: Partial<Website>): Promise<Website> => {
  const current = await getWebsites();
  const index = current.findIndex((website) => website.id === id);
  if (index === -1) throw new Error('Website not found.');

  const next = {
    ...current[index],
    ...updates,
    name: (updates.name ?? current[index].name).trim(),
    url: (updates.url ?? current[index].url).trim(),
    description: (updates.description ?? current[index].description).trim(),
    thumbnail: (updates.thumbnail ?? current[index].thumbnail).trim() || getDefaultWebsiteThumbnail((updates.name ?? current[index].name).trim()),
    tags: (updates.tags ?? current[index].tags).map((tag) => tag.trim()).filter(Boolean),
    updatedAt: new Date().toISOString(),
  };

  if (!/^https?:\/\//i.test(next.url)) {
    throw new Error('Please provide a valid website URL starting with http:// or https://');
  }

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'websites', id), next);
      return next;
    } catch (error) {
      console.warn('Firebase website update failed, falling back to local storage:', error);
    }
  }

  const updated = [...current];
  updated[index] = next;
  writeJson(WEBSITE_KEY, updated);
  return next;
};

export const deleteWebsite = async (id: string): Promise<void> => {
  const websites = await getWebsites();

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'websites', id));
    } catch (error) {
      console.warn('Firebase website delete failed:', error);
    }
  }

  writeJson(WEBSITE_KEY, websites.filter((website) => website.id !== id));
};

export const searchWebsites = async (search: string, categoryId?: string): Promise<Website[]> => {
  const websites = await getWebsites();
  const term = search.trim().toLowerCase();

  return websites.filter((website) => {
    const matchesSearch = !term || `${website.name} ${website.description} ${website.tags.join(' ')}`.toLowerCase().includes(term);
    const matchesCategory = !categoryId || categoryId === 'all' || website.categoryId === categoryId;
    return matchesSearch && matchesCategory;
  });
};
