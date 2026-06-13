import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  setDoc,
  getDoc,
  getDocs,
  where,
  QueryConstraint
} from 'firebase/firestore';
import { db, auth } from './firebase';

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
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Generic Firestore Hooks/Services ---

export const subscribeToCollection = (collectionPath: string, callback: (data: any[]) => void, constraints: QueryConstraint[] = []) => {
  const q = query(collection(db, collectionPath), ...constraints, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  });
};

export const addItem = async (collectionPath: string, item: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...item,
      authorId: auth.currentUser?.uid,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
};

export const updateItem = async (collectionPath: string, id: string, updates: any) => {
  try {
    const docRef = doc(db, collectionPath, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionPath}/${id}`);
  }
};

export const deleteItem = async (collectionPath: string, id: string) => {
  try {
    const docRef = doc(db, collectionPath, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionPath}/${id}`);
  }
};

export const saveUserProfile = async (user: any) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
};

export const updateUserSettings = async (userId: string, updates: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
  }
};

export const sendNotification = async (userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'game' | 'photo' | 'letter', link?: string) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type,
      read: false,
      link: link || '',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'notifications');
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `notifications/${notificationId}`);
  }
};

export const getPartnerUid = async (currentUid: string) => {
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const otherUser = usersSnap.docs.find(doc => doc.id !== currentUid);
    return otherUser ? otherUser.id : null;
  } catch (error) {
    console.error("Error finding partner:", error);
    return null;
  }
};

export const deleteUserAccount = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    // Note: Re-authentication is usually required to delete the Auth account itself via auth.currentUser.delete()
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
  }
};

export const subscribeToDocument = (collectionPath: string, docId: string, callback: (data: any) => void) => {
  const docRef = doc(db, collectionPath, docId);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `${collectionPath}/${docId}`);
  });
};
