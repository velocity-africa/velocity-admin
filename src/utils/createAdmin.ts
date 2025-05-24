import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export async function createFirstAdmin(email: string, password: string) {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Create admin document in Firestore
    await setDoc(doc(db, 'admins', userId), {
      email,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    console.log('Admin created successfully!');
    return userCredential.user;
  } catch (error: any) {
    console.error('Error creating admin:', error.message);
    throw error;
  }
}