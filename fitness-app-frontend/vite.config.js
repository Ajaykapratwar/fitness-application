import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Strict Mode remount can leave loginInProgress=true before redirect completes;
  // react-oauth2-code-pkce then errors with no ?code= in the URL.
  plugins: [react({ strict: false })],
})
