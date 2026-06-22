import { create } from 'zustand';
import { User, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNotificationsStore } from './notifications';

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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
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

interface UserProfile {
  banner?: string;
  avatar?: string;
  displayName?: string;
  username?: string;
  cargo?: string;
  empresa?: string;
  localizacao?: string;
  website?: string;
  bio?: string;
  heartPoints?: number;
  // Social links
  github?: string;
  linkedin?: string;
  instagram?: string;
  discord?: string;
  twitter?: string;
  youtube?: string;
  status?: 'online' | 'idle' | 'dnd' | 'invisible';
  // Gamification & Identities
  level?: number;
  xp?: number;
  selectedBadges?: string[];
  unlockedBadges?: string[];
  selectedTitle?: string;
  unlockedTitles?: string[];
  selectedEffect?: string;
  unlockedEffects?: string[];
  selectedFrame?: string;
  unlockedFrames?: string[];
  lastClaimDate?: string;
  telefone?: string;
  nicknameRpg?: string;
  codigoSecreto?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  updateAvatar: (base64Image: string) => Promise<void>;
  updateBanner: (base64Image: string) => Promise<void>;
  updateProfileFields: (fields: Partial<UserProfile>) => Promise<void>;
  addHeartPoints: (amount: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: async (user) => {
    if (!user) {
      set({ user: null, profile: null, loading: false });
      return;
    }
    
    // Load profile from firestore
    try {
      const docRef = doc(db, 'user_profiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        
        // Ensure default properties exist
        const profileData: UserProfile = {
          status: 'online',
          heartPoints: 200, // Starts with 200 free heart points
          level: 28,
          xp: 4450,
          selectedBadges: ['founder', 'premium'],
          unlockedBadges: ['founder', 'premium', 'verified_couple'],
          selectedTitle: 'dev_full',
          unlockedTitles: ['dev_full', 'founder', 'none', 'pioneer'],
          selectedEffect: 'none',
          unlockedEffects: ['none', 'soft_glow'],
          selectedFrame: 'none',
          unlockedFrames: ['none', 'basic_white'],
          lastClaimDate: '',
          ...data
        };
        
        // If there's an avatar in firestore profile, keep it synced in user.photoURL
        const updatedUser = { ...user, photoURL: profileData.avatar || user.photoURL } as User;
        set({ user: updatedUser, profile: profileData, loading: false });
      } else {
        // Create initial default profile on first load
        const fallbackProfile: UserProfile = {
          status: 'online',
          heartPoints: 200,
          level: 28,
          xp: 4450,
          selectedBadges: ['founder', 'premium'],
          unlockedBadges: ['founder', 'premium', 'verified_couple'],
          selectedTitle: 'dev_full',
          unlockedTitles: ['dev_full', 'founder', 'none', 'pioneer'],
          selectedEffect: 'none',
          unlockedEffects: ['none', 'soft_glow'],
          selectedFrame: 'none',
          unlockedFrames: ['none', 'basic_white'],
          lastClaimDate: ''
        };
        const userRef = doc(db, 'user_profiles', user.uid);
        await setDoc(userRef, fallbackProfile, { merge: true });
        
        // Let's also merge photoURL to user in case user already has a photoURL from social login
        const updatedUser = { ...user, photoURL: user.photoURL || null } as User;
        set({ user: updatedUser, profile: fallbackProfile, loading: false });
      }
    } catch (error) {
      set({ user, profile: {}, loading: false });
      handleFirestoreError(error, OperationType.GET, `user_profiles/${user.uid}`);
    }
  },
  updateAvatar: async (base64Image) => {
    const { user, profile } = get();
    if (!user) return;
    
    try {
      // Safe update to Firebase Auth's profile. Failures are caught and logged, not blocking.
      try {
        await updateProfile(user, { photoURL: base64Image });
      } catch (authProfileError) {
        console.warn("Could not save avatar directly to Firebase Auth profile. Continuing with Firestore save.", authProfileError);
      }

      const userRef = doc(db, 'user_profiles', user.uid);
      await setDoc(userRef, { avatar: base64Image }, { merge: true });
      set({ profile: { ...profile, avatar: base64Image }, user: { ...user, photoURL: base64Image } as User });
      
      // Trigger system notification
      useNotificationsStore.getState().addNotification(
        'Foto de Perfil Atualizada',
        'Seu novo avatar de usuário foi configurado e salvo com sucesso.',
        'low',
        'system',
        'sparkles'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `user_profiles/${user.uid}`);
    }
  },
  updateBanner: async (base64Image) => {
    const { user, profile } = get();
    if (!user) return;
    
    try {
      const userRef = doc(db, 'user_profiles', user.uid);
      await setDoc(userRef, { banner: base64Image }, { merge: true });
      set({ profile: { ...profile, banner: base64Image } });

      // Trigger system notification
      useNotificationsStore.getState().addNotification(
        'Banner de Perfil Atualizado',
        'Seu banner do dashboard foi atualizado com sucesso.',
        'low',
        'system',
        'gift'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `user_profiles/${user.uid}`);
    }
  },
  updateProfileFields: async (fields) => {
    const { user, profile } = get();
    if (!user || !profile) return;
    
    try {
      const userRef = doc(db, 'user_profiles', user.uid);
      await setDoc(userRef, fields, { merge: true });
      set({ profile: { ...profile, ...fields } });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `user_profiles/${user.uid}`);
    }
  },
  addHeartPoints: async (amount) => {
    const { user, profile } = get();
    if (!user || !profile) return;
    
    const currentPoints = profile.heartPoints ?? 0;
    const newPoints = currentPoints + amount;
    
    try {
      const userRef = doc(db, 'user_profiles', user.uid);
      await setDoc(userRef, { heartPoints: newPoints }, { merge: true });
      set({ profile: { ...profile, heartPoints: newPoints } });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `user_profiles/${user.uid}`);
    }
  }
}));

// Initialize auth listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});
