const keycloakBase = (import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8181').replace(/\/$/, '');
const realm = 'fitness-oauth2';

/**
 * Must match a "Valid redirect URI" in Keycloak exactly (including trailing slash if used).
 * Default: Vite dev server root — no trailing path so callback is http://localhost:5173/?code=...
 */
function getRedirectUri() {
  const fromEnv = import.meta.env.VITE_REDIRECT_URI?.trim();
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5173';
}

export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: `${keycloakBase}/realms/${realm}/protocol/openid-connect/auth`,
  tokenEndpoint: `${keycloakBase}/realms/${realm}/protocol/openid-connect/token`,
  redirectUri: getRedirectUri(),
  scope: 'openid profile email offline_access',
  /**
   * Do not auto-redirect on load: avoids React Strict Mode double-mount leaving
   * loginInProgress=true with no ?code= yet, and matches the explicit Login button.
   */
  autoLogin: false,
  /** Strip ?code=&state= from the address bar after a successful token exchange (default true; set explicitly for clarity). */
  clearURL: true,
  onRefreshTokenExpire: (event) => event.logIn(),
};
