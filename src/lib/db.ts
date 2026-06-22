import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firebase-utils';

export interface Story {
  id?: string;
  title: string;
  date: string;
  description: string;
  location: string;
  icon: string;
  imageUrl?: string | null;
  createdAt?: any;
}

export const addStory = async (story: Omit<Story, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'stories'), {
    ...story,
    createdAt: serverTimestamp()
  });
};

export const getStories = async () => {
  try {
    const q = query(collection(db, 'stories'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'stories');
  }
};

export const updateStory = async (id: string, data: Partial<Story>) => {
  const docRef = doc(db, 'stories', id);
  return await updateDoc(docRef, data);
};

export const deleteStory = async (id: string) => {
  const docRef = doc(db, 'stories', id);
  return await deleteDoc(docRef);
};

export interface Album {
  id?: string;
  title: string;
  date: string;
  category: string;
  coverUrl?: string | null;
  createdAt?: any;
}

export const addAlbum = async (album: Omit<Album, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'albums'), {
    ...album,
    createdAt: serverTimestamp()
  });
};

export const getAlbums = async () => {
  try {
    const q = query(collection(db, 'albums'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Album));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'albums');
  }
};

export const updateAlbum = async (id: string, data: Partial<Album>) => {
  const docRef = doc(db, 'albums', id);
  return await updateDoc(docRef, data);
};

export const deleteAlbum = async (id: string) => {
  const docRef = doc(db, 'albums', id);
  return await deleteDoc(docRef);
};

export interface Photo {
  id?: string;
  albumId?: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  createdAt?: any;
}

export const addPhoto = async (photo: Omit<Photo, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'photos'), {
    ...photo,
    createdAt: serverTimestamp()
  });
};

export const getPhotos = async () => {
  try {
    const q = query(collection(db, 'photos'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'photos');
  }
};
