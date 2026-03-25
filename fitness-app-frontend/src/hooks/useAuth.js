import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';

export function useAuth() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const userId = useSelector((s) => s.auth.userId);

  const roles = useMemo(() => tokenData?.realm_access?.roles || [], [tokenData]);
  const isAdmin = roles.includes('admin') || roles.includes('ADMIN');

  return {
    token,
    tokenData,
    logIn,
    logOut,
    isAuthenticated,
    userId,
    roles,
    isAdmin,
  };
}
