/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as fbSignOut, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, collection, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { Cafe, Booking, User as AppUser } from '../types';
import { INITIAL_CAFES } from '../data';

import firebaseConfig from '../../firebase-applet-config.json';

// Safety check for Firebase config
let isFirebaseReady = false;
let dbInstance: any = null;
let authInstance: any = null;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid || null,
      email: authInstance?.currentUser?.email || null,
      emailVerified: authInstance?.currentUser?.emailVerified || null,
      isAnonymous: authInstance?.currentUser?.isAnonymous || null,
      tenantId: authInstance?.currentUser?.tenantId || null,
      providerInfo: authInstance?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

try {
  if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId) {
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    const dbId = (firebaseConfig as any).firestoreDatabaseId || undefined;
    dbInstance = getFirestore(app, dbId);
    authInstance = getAuth(app);
    isFirebaseReady = true;
    console.log('Firebase initialized successfully with configuration from firebase-applet-config.json!');
  }
} catch (error) {
  console.warn('Firebase failed to initialize from config file. Falling back to active local persistence.', error);
}

// -----------------------------------------------------------------
// LOCAL PERSISTENCE BACKUP (Garantikan Data Tidak Hilang)
// -----------------------------------------------------------------
const LOCAL_STORAGE_KEYS = {
  USERS: 'studycafe_users',
  BOOKINGS: 'studycafe_bookings',
  CAFES: 'studycafe_cafes',
  CURRENT_USER: 'studycafe_current_user',
};

// Seed Local Storage if not seeded yet
const getStoredCafes = (): Cafe[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.CAFES);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CAFES;
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.CAFES, JSON.stringify(INITIAL_CAFES));
  return INITIAL_CAFES;
};

const getStoredBookings = (): Booking[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKINGS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
};

const getStoredUsers = (): AppUser[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
};

// -----------------------------------------------------------------
// DUAL-PERSISTENCE API WRAPPER
// -----------------------------------------------------------------
export const getCafes = async (): Promise<Cafe[]> => {
  if (isFirebaseReady && dbInstance) {
    const path = 'cafes';
    try {
      const cafeSnap = await getDocs(collection(dbInstance, path));
      const list: Cafe[] = [];
      cafeSnap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Cafe);
      });
      
      if (list.length > 0) {
        // If there are cafes in Firebase but some new INITIAL_CAFES are missing, sync them
        const retrievedIds = new Set(list.map((c) => c.id));
        const missingCafes = INITIAL_CAFES.filter((c) => !retrievedIds.has(c.id));
        
        if (missingCafes.length > 0) {
          console.log(`Syncing ${missingCafes.length} missing initial cafes to Firestore...`);
          for (const cafe of missingCafes) {
            try {
              await setDoc(doc(dbInstance, 'cafes', cafe.id), cafe);
              list.push(cafe);
            } catch (err) {
              console.warn(`Failed to seed missing cafe ${cafe.id}:`, err);
            }
          }
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.CAFES, JSON.stringify(list));
        return list;
      } else {
        // Database is empty. Let's seed initial cafes into Firestore
        console.log('Firestore cafes collection is empty. Seeding INITIAL_CAFES...');
        for (const cafe of INITIAL_CAFES) {
          try {
            await setDoc(doc(dbInstance, 'cafes', cafe.id), cafe);
          } catch (e) {
            console.warn(`Failed to seed cafe ${cafe.id}:`, e);
          }
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.CAFES, JSON.stringify(INITIAL_CAFES));
        return INITIAL_CAFES;
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  }
  return getStoredCafes();
};

export const saveCafe = async (cafe: Cafe): Promise<void> => {
  // Save locally
  const current = getStoredCafes();
  const index = current.findIndex((c) => c.id === cafe.id);
  if (index !== -1) {
    current[index] = cafe;
  } else {
    current.push(cafe);
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.CAFES, JSON.stringify(current));

  // Save to Firebase if ready
  if (isFirebaseReady && dbInstance) {
    const path = `cafes/${cafe.id}`;
    try {
      await setDoc(doc(dbInstance, 'cafes', cafe.id), cafe);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
};

export const deleteCafe = async (cafeId: string): Promise<void> => {
  // Delete locally
  const current = getStoredCafes();
  const updated = current.filter((c) => c.id !== cafeId);
  localStorage.setItem(LOCAL_STORAGE_KEYS.CAFES, JSON.stringify(updated));

  // Firebase
  if (isFirebaseReady && dbInstance) {
    const path = `cafes/${cafeId}`;
    try {
      await deleteDoc(doc(dbInstance, 'cafes', cafeId));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  }
};

export const getBookings = async (): Promise<Booking[]> => {
  if (isFirebaseReady && dbInstance) {
    const path = 'bookings';
    try {
      const snap = await getDocs(collection(dbInstance, path));
      const list: Booking[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Booking);
      });
      localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
      return list;
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  }
  return getStoredBookings();
};

export const saveBooking = async (booking: Booking): Promise<void> => {
  const current = getStoredBookings();
  const index = current.findIndex((b) => b.id === booking.id);
  if (index !== -1) {
    current[index] = booking;
  } else {
    current.push(booking);
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(current));

  if (isFirebaseReady && dbInstance) {
    const path = `bookings/${booking.id}`;
    try {
      await setDoc(doc(dbInstance, 'bookings', booking.id), booking);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
};

// Custom credentials register / login list mechanism to store users
export const getAppUsers = async (): Promise<AppUser[]> => {
  if (isFirebaseReady && dbInstance) {
    const path = 'users';
    try {
      const snap = await getDocs(collection(dbInstance, path));
      const list: AppUser[] = [];
      snap.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as AppUser);
      });
      localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(list));
      return list;
    } catch (e) {
      console.warn('Failed to fetch users from Firestore, using local fallback:', e);
    }
  }
  return getStoredUsers();
};

export const registerUser = async (user: AppUser): Promise<void> => {
  const current = getStoredUsers();
  if (!current.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    current.push(user);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(current));
  }

  if (isFirebaseReady && dbInstance) {
    const path = `users/${user.id}`;
    try {
      await setDoc(doc(dbInstance, 'users', user.id), user);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  }
};

export { isFirebaseReady, dbInstance, authInstance };
