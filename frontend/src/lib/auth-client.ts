import { createAuthClient } from "better-auth/react";

// Better Auth expects the base URL of the server (without /api/auth)
// If VITE_API_URL is set to /api, we need to construct the full URL
const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  
  // If it's a relative path like /api, use window.location.origin
  if (apiUrl.startsWith('/')) {
    return window.location.origin;
  }
  
  // If it's a full URL with /api, remove /api
  if (apiUrl.includes('/api')) {
    return apiUrl.replace('/api', '');
  }
  
  // Otherwise use as-is (should be full URL like http://localhost:3001)
  return apiUrl.replace('/api', '');
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),
    fetchOptions: {
        credentials: 'include', // Include cookies in requests
    },
});

export const { signIn, signUp, signOut, useSession } = authClient;

