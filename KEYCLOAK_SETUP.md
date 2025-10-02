# Keycloak Authentication Setup

This document provides instructions for setting up Keycloak authentication with NextAuth.js.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Keycloak Configuration
KEYCLOAK_ID=your-keycloak-client-id
KEYCLOAK_SECRET=your-keycloak-client-secret
KEYCLOAK_ISSUER=http://your-keycloak-server/realms/your-realm
KEYCLOAK_CLIENT_ID=your-keycloak-client-id

# Backend API
NEXT_PUBLIC_BASE_URL=http://localhost:8080/api/v1
```

## Keycloak Setup

1. **Create a Keycloak Realm**
   - Access your Keycloak admin console
   - Create a new realm or use an existing one

2. **Create a Client**
   - Go to Clients → Create
   - Set Client ID (use this for `KEYCLOAK_ID` and `KEYCLOAK_CLIENT_ID`)
   - Set Client Protocol to `openid-connect`
   - Set Access Type to `confidential`

3. **Configure Client Settings**
   - Valid Redirect URIs: `http://localhost:3000/api/auth/callback/keycloak`
   - Web Origins: `http://localhost:3000`
   - Get the client secret from the Credentials tab (use for `KEYCLOAK_SECRET`)

4. **Configure Roles**
   - Create roles: `ADMIN`, `ADVISER`, `STUDENT`, `PUBLIC`
   - Assign roles to users as needed

## Testing the Authentication Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login` to test the Keycloak authentication
3. After successful login, you'll be redirected to `/profile`

## Troubleshooting

- Ensure all environment variables are correctly set
- Check that Keycloak server is running and accessible
- Verify redirect URIs match exactly in Keycloak client configuration
- Check browser console for any CORS or network errors
