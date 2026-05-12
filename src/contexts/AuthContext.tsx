import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  role: 'faculty' | 'admin';
  faculty: string;
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: 'faculty' | 'admin' | null;
  loading: boolean;
  signUp: (email: string, pass: string, name: string, faculty: string) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null,
  role: null, 
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {} 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<'faculty' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * TESTING NOTE:
   * To change a user to an Admin for testing:
   * 1. Go to Firebase Console -> Firestore Database.
   * 2. Find the 'users' collection.
   * 3. Select the document with the user's uid.
   * 4. Change the 'role' field from 'faculty' to 'admin'.
   * 5. Refresh the application to see Admin privileges.
   */
  const fetchUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        setRole(data.role);
      } else {
        // Fallback for demo or when doc is missing but user exists
        setRole('faculty');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setRole('faculty');
    }
  };

  const signUp = async (email: string, pass: string, name: string, faculty: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'faculty', // Default role
        faculty,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      setUser(user);
      setProfile(userProfile);
      setRole('faculty');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      await fetchUserProfile(userCredential.user.uid);
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser.uid);
      } else {
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signUp, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
