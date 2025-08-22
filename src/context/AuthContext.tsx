import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { child, get, ref, set } from "firebase/database";
import type { UserDB } from "../types/types";

interface AuthContextType {
  user: User | null;
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  isUsernameTaken: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  const isUsernameTaken = async (username: string) => {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "users"));
    if (!snapshot.exists()) return false;

    const usersObj = snapshot.val();
    const users: UserDB[] = Object.values(usersObj) as UserDB[];
    return users.some((user) => user.username === username);
  };
  const signup = async (username: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const formattedUsername = username
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase();

    await updateProfile(userCredential.user, {
      displayName: formattedUsername,
    });
    await set(ref(db, "users/" + userCredential.user.uid), {
      id: userCredential.user.uid,
      username: formattedUsername,
      email: email,
    });
  };
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };
  const logout = async () => {
    await auth.signOut();
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, loginWithGoogle, isUsernameTaken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
