import NextAuth from "next-auth/next";
import Keycloak from "next-auth/providers/keycloak";

// Use the global NextAuth type augmentations defined in src/types/next-auth.d.ts

const API_BASE = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');

export const authOptions = {
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          prompt: "login",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        (token as any).accessToken = account.access_token!;
        (token as any).refreshToken = account.refresh_token!;

        const payload = JSON.parse(
          Buffer.from(account.access_token!.split(".")[1], "base64").toString()
        );

        // Fetch user profile from backend API
        try {
          const response = await fetch(`${API_BASE}/auth/user/profile`, {
            headers: {
              'Authorization': `Bearer ${account.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            (token as any).user = {
              slug: userData.user?.slug || null,
              uuid: userData.user?.uuid || payload.sub || null,
              userName: userData.user?.userName || payload.preferred_username || null,
              gender: userData.user?.gender || null,
              email: userData.user?.email || payload.email || null,
              fullName: userData.user?.fullName || null,
              firstName: userData.user?.firstName || null,
              lastName: userData.user?.lastName || null,
              imageUrl: userData.user?.imageUrl || null,
              status: userData.user?.status || null,
              createDate: userData.user?.createDate || null,
              updateDate: userData.user?.updateDate || null,
              bio: userData.user?.bio || null,
              address: userData.user?.address || null,
              contactNumber: userData.user?.contactNumber || null,
              telegramId: userData.user?.telegramId || null,
              isUser: userData.user?.isUser || false,
              isAdmin: userData.user?.isAdmin || false,
              isStudent: userData.user?.isStudent || false,
              isAdvisor: userData.user?.isAdvisor || false,
              roles: [
                ...(payload.realm_access?.roles || []),
                ...(payload.resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]?.roles || []),
              ],
              student: userData.student || null,
              adviser: userData.adviser || null
            };
          } else {
            // Fallback to token data if API call fails
            (token as any).user = {
              slug: null,
              uuid: payload.sub || null,
              userName: payload.preferred_username || null,
              gender: null,
              email: payload.email || null,
              fullName: null,
              firstName: null,
              lastName: null,
              imageUrl: null,
              status: null,
              createDate: null,
              updateDate: null,
              bio: null,
              address: null,
              contactNumber: null,
              telegramId: null,
              isUser: false,
              isAdmin: false,
              isStudent: false,
              isAdvisor: false,
              roles: [
                ...(payload.realm_access?.roles || []),
                ...(payload.resource_access?.[process.env.KEYCLOAK_ID!]?.roles || []),
              ],
              student: null,
              adviser: null
            };
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Fallback to token data
          (token as any).user = {
            slug: null,
            uuid: payload.sub || null,
            userName: payload.preferred_username || null,
            gender: null,
            email: payload.email || null,
            fullName: null,
            firstName: null,
            lastName: null,
            imageUrl: null,
            status: null,
            createDate: null,
            updateDate: null,
            bio: null,
            address: null,
            contactNumber: null,
            telegramId: null,
            isUser: false,
            isAdmin: false,
            isStudent: false,
            isAdvisor: false,
            roles: [
              ...(payload.realm_access?.roles || []),
              ...(payload.resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]?.roles || []),
            ],
            student: null,
            adviser: null
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Delegate typing to global module augmentation
      (session as any).user = (token as any).user;
      (session as any).accessToken = (token as any).accessToken;
      (session as any).refreshToken = (token as any).refreshToken;
      (session as any).accessTokenExpires = (token as any).exp;
      return session;
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
