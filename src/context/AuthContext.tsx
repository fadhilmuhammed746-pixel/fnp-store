import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateCustomerProfile: (updates: Partial<UserProfile>) => Promise<void>;
  verifyAdminKey: (key: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_ADMIN_KEY = '866319';
const LOCAL_PROFILE_KEY = 'fnp_user_profile_v1';
const ADMIN_SESSION_KEY = 'fnp_admin_session_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_PROFILE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'granted') return true;
    try {
      const cached = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed.role === 'admin';
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Centralized Firebase Authentication State Listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // In offline / local mock mode, retrieve persisted profile if present
      const cached = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setProfile(parsed);
          if (parsed.role === 'admin' || sessionStorage.getItem(ADMIN_SESSION_KEY) === 'granted') {
            setIsAdmin(true);
          }
        } catch {
          // ignore
        }
      }
      setIsLoading(false);
      return;
    }

    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user);

          let userRole: UserRole = 'customer';
          let userProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Customer',
            role: 'customer',
            createdAt: new Date().toISOString()
          };

          if (db) {
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                userProfile = userDoc.data() as UserProfile;
                userRole = userProfile.role;
              } else {
                await setDoc(doc(db, 'users', user.uid), userProfile);
              }
            } catch (err) {
              console.warn('Failed to load user document from Firestore, using default profile:', err);
            }
          }

          const isAuthorizedAdmin = userRole === 'admin' || sessionStorage.getItem(ADMIN_SESSION_KEY) === 'granted';
          setIsAdmin(isAuthorizedAdmin);
          setProfile(userProfile);
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(userProfile));
        } else {
          setCurrentUser(null);
          // Only clear profile if not authenticated via master admin session
          if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== 'granted') {
            setProfile(null);
            setIsAdmin(false);
            localStorage.removeItem(LOCAL_PROFILE_KEY);
          }
        }
      } catch (err) {
        console.error('Error handling auth state change:', err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        setCurrentUser(user);

        // Populate profile immediately so that callers don't face race conditions
        let userProfile: UserProfile = {
          uid: user.uid,
          email: user.email || email,
          displayName: user.displayName || email.split('@')[0] || 'Customer',
          role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        };

        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              userProfile = userDoc.data() as UserProfile;
            } else {
              await setDoc(doc(db, 'users', user.uid), userProfile);
            }
          } catch (err) {
            console.warn('Firestore profile fetch warning on login:', err);
          }
        }

        const isAuthorizedAdmin = userProfile.role === 'admin' || sessionStorage.getItem(ADMIN_SESSION_KEY) === 'granted';
        setIsAdmin(isAuthorizedAdmin);
        setProfile(userProfile);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(userProfile));
      } else {
        // Local mock login for offline / unconfigured demo
        const mockProfile: UserProfile = {
          uid: 'usr-' + Date.now(),
          email,
          displayName: email.split('@')[0] || 'Customer',
          role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        };
        setProfile(mockProfile);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(mockProfile));
        if (mockProfile.role === 'admin') {
          setIsAdmin(true);
          sessionStorage.setItem(ADMIN_SESSION_KEY, 'granted');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name });
        
        const newProfile: UserProfile = {
          uid: userCredential.user.uid,
          email,
          displayName: name,
          role: 'customer',
          createdAt: new Date().toISOString()
        };

        if (db) {
          try {
            await setDoc(doc(db, 'users', userCredential.user.uid), newProfile);
          } catch (err) {
            console.warn('Failed to save user profile in Firestore:', err);
          }
        }
        setCurrentUser(userCredential.user);
        setProfile(newProfile);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProfile));
      } else {
        const mockProfile: UserProfile = {
          uid: 'usr-' + Date.now(),
          email,
          displayName: name,
          role: 'customer',
          createdAt: new Date().toISOString()
        };
        setProfile(mockProfile);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(mockProfile));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
    setCurrentUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_PROFILE_KEY);

    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      await new Promise(res => setTimeout(res, 500));
    }
  };

  const updateCustomerProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates, updatedAt: new Date().toISOString() };
    setProfile(updated);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));

    if (isFirebaseConfigured && db && currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
      } catch (err) {
        console.error('Failed to update profile in Firestore:', err);
      }
    }
  };

  const verifyAdminKey = (key: string): boolean => {
    if (key.trim() === MASTER_ADMIN_KEY) {
      setIsAdmin(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'granted');
      if (profile) {
        const updated = { ...profile, role: 'admin' as UserRole };
        setProfile(updated);
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));
      }
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        updateCustomerProfile,
        verifyAdminKey
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
