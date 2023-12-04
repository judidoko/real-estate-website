import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function useAuthStatus() {
  // To check if LoggedIn is true Hook
  const [loggedIn, setLoggedIn] = useState(false);

  //   Loading Hook
  const [loading, setLoading] = useState(true);

  //   UseEffect ask Firebase if user is Authenticated or not
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setLoading(false);
    });
  }, []);

  return { loggedIn, loading };
}
