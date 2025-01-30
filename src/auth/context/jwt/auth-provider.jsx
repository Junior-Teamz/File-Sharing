import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo, useState } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------
const initialState = {
  user: null,
  roles: [],
  is_superadmin: false,
  loading: true,
  accessToken: null,
  refreshToken: null,
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
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        roles: [],
        is_superadmin: false,
        accessToken: null,
        refreshToken: null,
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------
const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  // Initialize the authentication state
  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axiosInstance.get(endpoints.auth.me);
        const { data: user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: { user, roles: user.roles || [], is_superadmin: user.is_superadmin || false },
        });
      } else {
        dispatch({ type: 'INITIAL', payload: { user: null } });
      }
    } catch (error) {
      console.error('Initialization Error:', error);
      dispatch({ type: 'INITIAL', payload: { user: null } });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(
    async (email, password) => {
      const data = { email, password };

      try {
        const response = await axiosInstance.post(endpoints.auth.login, data);
        const { accessToken, roles, is_superadmin, user, refreshToken } = response.data;

        // Set session with accessToken
        setSession(accessToken);

        // Dispatch login action
        dispatch({
          type: 'LOGIN',
          payload: {
            user,
            roles,
            is_superadmin,
            accessToken,
            refreshToken,
          },
        });

        console.log(roles);

        const userRoles = roles;
        const isSuperadmin = is_superadmin ?? false;

        console.log(userRoles)
        console.log(isSuperadmin)

        if (userRoles?.includes('admin') || isSuperadmin) {
          router.push('/dashboard');
        } else if (userRoles?.includes('user')) 
          router.push('/dashboarduser');
       

        await initialize();

        return { accessToken, roles, is_superadmin, user };
      } catch (error) {
        console.error('Login Error:', error);
        throw error;
      }
    },
    [initialize]
  );

  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = { email, password, firstName, lastName };

    try {
      const response = await axiosInstance.post(endpoints.auth.register, data);
      const { user } = response.data;

      dispatch({
        type: 'REGISTER',
        payload: { user, roles: user.roles || [], is_superadmin: user.is_superadmin || false },
      });
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    const { refreshToken } = state;

    try {
      await axiosInstance.post(endpoints.auth.logout, {
        refreshToken: refreshToken || '',
      });
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      sessionStorage.removeItem(STORAGE_KEY);
      dispatch({ type: 'LOGOUT' });
    }
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
