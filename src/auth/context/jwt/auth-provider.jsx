import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------
const initialState = {
  user: null,
  roles: [],
  is_superadmin: false,
  loading: true,
  accessToken: null, // Tambahkan accessToken ke state
  refreshToken: null, // Tambahkan refreshToken ke state
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL':
      return {
        ...state,
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
        accessToken: action.payload.accessToken, // Simpan accessToken
        refreshToken: action.payload.refreshToken, // Simpan refreshToken
      };
    case 'LOGOUT':
      return { ...state, user: null, roles: [], is_superadmin: false, accessToken: null, refreshToken: null }; // Reset state
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
  
      const { refreshToken, accessToken, roles, is_superadmin, user } = response.data;

      setSession(accessToken); // Set accessToken in session storage
      setSession(refreshToken); // Set refreshToken in session storage

      dispatch({
        type: 'LOGIN',
        payload: {
          user,
          roles,
          is_superadmin,
          accessToken, // Simpan accessToken
          refreshToken, // Simpan refreshToken
        },
      });

      return {
        accessToken,
        roles,
        is_superadmin,
        user,
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = { email, password, firstName, lastName };

    const response = await axiosInstance.post(endpoints.auth.register, data);
    const { user } = response.data;

    dispatch({ type: 'REGISTER', payload: { user } });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    const { refreshToken, accessToken } = state; // Ambil refreshToken dan accessToken dari state
  
    await axiosInstance.post(endpoints.auth.logout, {
      accessToken, // Sertakan accessToken dalam body permintaan
      refreshToken, // Sertakan refreshToken dalam body permintaan
    });

    sessionStorage.removeItem(STORAGE_KEY); // Hapus access token dari session storage
    sessionStorage.removeItem('REFRESH_TOKEN_KEY'); // Hapus refresh token dari session storage

    dispatch({ type: 'LOGOUT' }); // Reset state
  }, [state]);
  
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
