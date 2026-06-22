import { create } from 'zustand';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp, 
  writeBatch, 
  getDocs, 
  orderBy, 
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationCategory = 'system' | 'social' | 'store' | 'achievement' | 'event' | 'promotion';

export interface AppNotification {
  id: string;
  userId: string; // user.uid or 'global'
  title: string;
  message: string;
  type: NotificationPriority; // 'low' (info), 'medium' (warning), 'high' (important), 'critical' (urgent)
  category: NotificationCategory;
  icon: string; // e.g., 'bell', 'heart', 'shopping-bag', 'trophy', 'sparkles', 'gift'
  url?: string;
  readed: boolean;
  createdAt: any;
}

export interface NotificationPreferences {
  system: boolean;
  social: boolean;
  store: boolean;
  achievements: boolean;
  events: boolean;
  promotions: boolean;
}

interface NotificationsState {
  notifications: AppNotification[];
  preferences: NotificationPreferences;
  loading: boolean;
  activeCategory: string; // 'all' or categories
  categoryFilter: string; // currently viewed category filter
  
  // Actions
  addNotification: (title: string, message: string, type: NotificationPriority, category: NotificationCategory, icon: string, url?: string, targetUserId?: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  loadPreferences: () => Promise<void>;
  sendGlobalNotification: (title: string, message: string, type: NotificationPriority, category: NotificationCategory, icon: string, url?: string) => Promise<void>;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  system: true,
  social: true,
  store: true,
  achievements: true,
  events: true,
  promotions: true
};

let unsubscribeListener: (() => void) | null = null;

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  preferences: DEFAULT_PREFERENCES,
  loading: true,
  activeCategory: 'all',
  categoryFilter: 'all',

  addNotification: async (title, message, type, category, icon, url, targetUserId) => {
    try {
      const currentUser = auth.currentUser;
      const targetId = targetUserId || currentUser?.uid;

      if (!targetId) return;

      // Create local document representation
      const payload = {
        userId: targetId,
        title,
        message,
        type,
        category,
        icon,
        url: url || '',
        readed: false,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'notifications'), payload);
    } catch (e) {
      console.error('Failed to create notification:', e);
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, { readed: true });
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  },

  markAllAsRead: async () => {
    try {
      const unread = get().notifications.filter(n => !n.readed);
      if (unread.length === 0) return;

      const batch = writeBatch(db);
      unread.forEach(n => {
        const ref = doc(db, 'notifications', n.id);
        batch.update(ref, { readed: true });
      });
      await batch.commit();
      toast.success('Todas as notificações foram marcadas como lidas! 🧹');
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await deleteDoc(docRef);
      toast.success('Notificação removida do histórico.');
    } catch (e) {
      console.error('Failed to delete notification:', e);
    }
  },

  clearAll: async () => {
    try {
      const userNotifications = get().notifications.filter(n => n.userId !== 'global');
      if (userNotifications.length === 0) return;

      const batch = writeBatch(db);
      userNotifications.forEach(n => {
        const ref = doc(db, 'notifications', n.id);
        batch.delete(ref);
      });
      await batch.commit();
      toast.success('Histórico de notificações limpo!');
    } catch (e) {
      console.error('Failed to clear notifications:', e);
    }
  },

  updatePreferences: async (prefs) => {
    const updated = { ...get().preferences, ...prefs };
    set({ preferences: updated });

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const docRef = doc(db, 'user_profiles', currentUser.uid);
        await setDoc(docRef, { notificationPreferences: updated }, { merge: true });
      } catch (e) {
        console.error('Failed to save notification preferences:', e);
      }
    }
  },

  loadPreferences: async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const docRef = doc(db, 'user_profiles', currentUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.notificationPreferences) {
            set({ preferences: data.notificationPreferences });
          }
        }
      } catch (e) {
        console.error('Failed to load notification preferences:', e);
      }
    }
  },

  sendGlobalNotification: async (title, message, type, category, icon, url) => {
    try {
      const payload = {
        userId: 'global',
        title,
        message,
        type,
        category,
        icon,
        url: url || '',
        readed: false,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'notifications'), payload);
      toast.success('Notificação Global agendada e enviada! 📢');
    } catch (e) {
      console.error('Failed to send global notification:', e);
    }
  }
}));

// Setup real-time authentication subscription to handle notifications snapshot
onAuthStateChanged(auth, (user) => {
  if (unsubscribeListener) {
    unsubscribeListener();
    unsubscribeListener = null;
  }

  if (user) {
    useNotificationsStore.getState().loadPreferences();

    // Query notifications securely filtered by user id or global to adhere to security rules.
    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [user.uid, 'global'])
    );

    // Filter in client-side to dynamically adhere to notificationPreferences or categories!
    // Since firestore doesn't allow OR query on different fields with orderBy easily without composites,
    // pulling the last 150 notifications and filtering in client side guarantees instant reactiveness!
    unsubscribeListener = onSnapshot(q, (snapshot) => {
      const list: AppNotification[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          ...data,
          // Fallback for timestamps loaded
          createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' 
            ? data.createdAt.toDate() 
            : (data.createdAt instanceof Date ? data.createdAt : new Date())
        } as AppNotification);
      });

      // Sort by createdAt descending since we removed orderBy from Firestore query
      list.sort((a, b) => {
        const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      // Filter based on user preferences in real-time
      const prefs = useNotificationsStore.getState().preferences;
      const filtered = list.filter(n => {
        // Map category to preferences
        let key: keyof NotificationPreferences = 'system';
        if (n.category === 'social') key = 'social';
        else if (n.category === 'store') key = 'store';
        else if (n.category === 'achievement') key = 'achievements';
        else if (n.category === 'event') key = 'events';
        else if (n.category === 'promotion') key = 'promotions';
        
        return prefs[key] !== false; // if it's not set or true, allow
      });

      // Check if there is a NEW unread high/critical notification since the last list
      // to display a nice toast.js instantly!
      const currentListState = useNotificationsStore.getState().notifications;
      const hasPrevious = currentListState.length > 0;
      
      // If we have new notifications, compare and trigger standard toast.js
      if (hasPrevious) {
        const previousIds = new Set(currentListState.map(n => n.id));
        const newUnreadAlerts = filtered.filter(n => !n.readed && !previousIds.has(n.id));
        
        newUnreadAlerts.forEach(alert => {
          // Play a small default notification sound if browser permits
          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              const audioCtx = new AudioContextClass();
              const oscillator = audioCtx.createOscillator();
              const gainNode = audioCtx.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              oscillator.type = 'triangle';
              oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
              oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
              gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
              oscillator.start(audioCtx.currentTime);
              oscillator.stop(audioCtx.currentTime + 0.4);
            }
          } catch (_) {
            console.warn('Audio feedback blocked or unavailable');
          }

          toast(`${alert.title}\n${alert.message}`, {
            duration: 5000,
            icon: alert.icon === 'crown' ? '👑' : alert.icon === 'heart' ? '💖' : alert.icon === 'trophy' ? '🏆' : alert.icon === 'gift' ? '🎁' : '🔔',
            style: {
              border: '3px solid #000',
              borderRadius: '12px',
              background: '#fff',
              boxShadow: '4px 4px 0px #000',
              fontFamily: 'sans-serif',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: '#000',
              whiteSpace: 'pre-line'
            }
          });
        });
      }

      useNotificationsStore.setState({ notifications: filtered, loading: false });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
      useNotificationsStore.setState({ loading: false });
    });
  } else {
    useNotificationsStore.setState({ notifications: [], loading: false });
  }
});
