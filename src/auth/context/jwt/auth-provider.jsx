import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';
// ----------------------------------------------------------------------
const initialState = {
  user: null,
  roles: [], // Tambahkan roles ke state
  is_superadmin: false, // Tambahkan is_superadmin ke state
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL':
      return {
        loading: false,
        user: action.payload.user,
        roles: action.payload.roles,
        is_superadmin: action.payload.is_superadmin,
      };
    case 'LOGIN':
    case 'REGISTER':
      return {
        ...state,
        user: action.payload.user,
        roles: action.payload.roles,
        is_superadmin: action.payload.is_superadmin,
      };
    case 'LOGOUT':
      return { ...state, user: null, roles: [], is_superadmin: false };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------
const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize the authentication state
  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken); // Set token in session and axios headers

        const response = await axiosInstance.get(endpoints.auth.me);
        const { data: user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: { user },
        });
      } else {
        dispatch({ type: 'INITIAL', payload: { user: null } });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'INITIAL', payload: { user: null } });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (email, password) => {
    const data = { email, password };
  
    try {
      const response = await axiosInstance.post(endpoints.auth.login, data);
      console.log('Login Response in AuthProvider:', response.data);
  
      const { accessToken, roles, is_superadmin, user } = response.data;
  
      setSession(accessToken); // Set session and add token to axios headers
  
      // // Set access token to localStorage
      // localStorage.setItem('accessToken', accessToken);
  
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
          roles,
          is_superadmin,
        },
      });
  
      // Return data to the caller
      return {
        accessToken,
        roles,
        is_superadmin,
        user,
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw error; // Rethrow error to be caught in the caller
    }
  }, []);
  
  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = { email, password, firstName, lastName };
  
    const response = await axiosInstance.post(endpoints.auth.register, data);
    const { user } = response.data;
  
    dispatch({ type: 'REGISTER', payload: { user } });
  }, []);
  
  // LOGOUT
  const logout = useCallback(async () => {
    await axiosInstance.post(endpoints.auth.logout); // Panggil endpoint logout di server
    
    // Remove access token from sessionStorage and localStorage
    // localStorage.removeItem('accessToken'); 
    sessionStorage.removeItem('accessToken'); // or any token you have in session storage if applicable
  
    dispatch({ type: 'LOGOUT' });
  }, []);
  

  // Status management
  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
