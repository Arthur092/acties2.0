import React, { useState, useEffect, useContext, createContext } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase";
interface ContextValue {
  user: User | null;
  isLoading: Boolean;
  signin: Function;
  signup: Function;
  signout: Function;
  setUser: Function;
}

export const AuthContext = createContext<ContextValue>({
  user: null,
  isLoading: true,
  signin: () => null,
  signup: () => null,
  signout: () => null,
  setUser: () => null,
});

interface Props {
  children: JSX.Element
}

export function ProvideAuth({ children }: Props) {
    const auth: ContextValue = useProvideAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

function useProvideAuth(): ContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth(app);

  const signin = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  };

  const signout = () => {
    return signOut(auth)
      .then(() => {
        setUser(null);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    signin,
    signup,
    signout,
    setUser
  };
}