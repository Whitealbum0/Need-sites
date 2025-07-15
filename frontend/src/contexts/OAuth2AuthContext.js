import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.access_token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.access_token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export const OAuth2AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  // Настройка axios interceptor
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [state.token]);

  // Загрузка пользователя при инициализации
  useEffect(() => {
    const initAuth = async () => {
      // Проверяем URL параметры для токена от OAuth2
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      const errorFromUrl = urlParams.get('error');
      
      if (tokenFromUrl) {
        // Токен пришел от OAuth2 callback
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromUrl}`;
          const response = await axios.get(`${API}/auth/me`);
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              access_token: tokenFromUrl,
              user: response.data
            }
          });
          
          // Очищаем URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Ошибка при получении пользователя:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Ошибка авторизации' });
        }
      } else if (errorFromUrl) {
        // Ошибка от OAuth2
        dispatch({ type: 'SET_ERROR', payload: decodeURIComponent(errorFromUrl) });
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // Проверяем сохраненный токен
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Проверяем валидность токена
            const response = await axios.get(`${API}/auth/me`);
            
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                access_token: token,
                user: response.data
              }
            });
          } catch (error) {
            console.error('Ошибка при проверке токена:', error);
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    initAuth();
  }, []);

  const loginWithGoogle = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    // Перенаправляем на Google OAuth2
    window.location.href = `${API}/auth/google`;
  };

  const loginWithGoogleToken = async (googleToken) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await axios.post(`${API}/auth/google/mobile`, {
        access_token: googleToken
      });
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Ошибка авторизации';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      delete axios.defaults.headers.common['Authorization'];
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    loginWithGoogle,
    loginWithGoogleToken,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an OAuth2AuthProvider');
  }
  return context;
};