import React, { useReducer, createContext, useEffect } from "react";
import firebaseReducer from "./reducers";
import { auth } from "../firebase";

// Create state
const initialState = {
  user: null,
  notify: {},
};

// Create context
const AuthContext = createContext();

// Create context provider to wrap application
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  // Grab user info upon page load
  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        dispatch({
          type: "LOGGED_IN_USER",
          payload: { email: user.email, token: idTokenResult.token },
        });
      } else {
        dispatch({
          type: "LOGGED_IN_USER",
          payload: null,
        });
      }
    });

    // cleanup
    return () => unSubscribe();
  }, []);

  const value = { state, dispatch };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export context and provider
export { AuthContext, AuthProvider };
