import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  getSession,
  clearSession,
  createSession,
  registerUser,
  loginUser,
  updateUserProfile,
  getUserById,
  extendSession,
} from '../utils/auth';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  session: null,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user, session: action.payload.session, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, session: null, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_SESSION':
      return { ...state, session: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logout = useCallback(() => {
    clearSession();
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Initialize from session
  useEffect(() => {
    const session = getSession();
    if (session) {
      const user = getUserById(session.userId);
      if (user) {
        dispatch({ type: 'SET_USER', payload: { user, session } });
      } else {
        clearSession();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Session expiry watcher
  useEffect(() => {
    if (!state.session) return;

    const interval = setInterval(() => {
      const session = getSession();
      if (!session) {
        dispatch({ type: 'LOGOUT' });
      } else {
        dispatch({ type: 'UPDATE_SESSION', payload: session });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.session?.expiresAt]);

  const register = async (name, email, password) => {
    const user = registerUser(name, email, password);
    return user;
  };

  const login = async (email, password) => {
    const user = loginUser(email, password);
    const session = createSession(user);
    dispatch({ type: 'SET_USER', payload: { user, session } });
    return user;
  };

  const updateProfile = async (updates) => {
    const updated = updateUserProfile(state.user.id, updates);
    dispatch({ type: 'UPDATE_USER', payload: updated });
    extendSession();
    return updated;
  };

  const refreshSession = () => {
    extendSession();
    const session = getSession();
    if (session) dispatch({ type: 'UPDATE_SESSION', payload: session });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register, updateProfile, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
