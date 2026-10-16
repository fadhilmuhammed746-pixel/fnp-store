import { collection, doc, getDocs, setDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { ContactMessage } from '../types';

const LOCAL_STORAGE_KEY = 'fnp_messages_v1';

const getLocalMessages = (): ContactMessage[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveLocalMessages = (msgs: ContactMessage[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(msgs));
};

export const submitContactMessage = async (msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> => {
  const id = 'msg-' + Date.now();
  const newMessage: ContactMessage = {
    ...msg,
    id,
    status: 'unread',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'contactMessages', id), newMessage);
    } catch (err) {
      console.error('Firestore submitContactMessage error:', err);
    }
  }

  const local = getLocalMessages();
  local.unshift(newMessage);
  saveLocalMessages(local);
  return newMessage;
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
      }
    } catch (err) {
      console.warn('Firestore getContactMessages error:', err);
    }
  }
  return getLocalMessages();
};

export const updateMessageStatus = async (id: string, status: 'unread' | 'read' | 'replied'): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { status });
    } catch (err) {
      console.error('Firestore updateMessageStatus error:', err);
    }
  }

  const local = getLocalMessages();
  const idx = local.findIndex(m => m.id === id);
  if (idx !== -1) {
    local[idx].status = status;
    saveLocalMessages(local);
  }
};
