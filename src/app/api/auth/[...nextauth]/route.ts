import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { Buffer } from "buffer";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null;
      username: string | null;
      email: string | null;
      roles: string[];
    };
    accessTokenExpires: number;
    accessToken: string;
    refreshToken: string;
    error?: string;
  }
  interface User {
    id: string | null;
    username: string | null;
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
    user?: {
      // Add this
      id: string | null;
      username: string | null;
      email: string | null;
      roles: string[];
    };
  }
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {

  try {
    const url = `${process.env.KEYCLOAK_TOKEN_ENDPOINT}`;

    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_ID!,
        client_secret: process.env.KEYCLOAK_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens: RefreshTokenResponse = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed:", refreshedTokens);
      throw refreshedTokens;
    }

    const payload = JSON.parse(
      Buffer.from(
        refreshedTokens.access_token.split(".")[1],
        "base64"
      ).toString()
    );

    const newExpiresAt = Math.floor(
      Date.now() / 1000 + refreshedTokens.expires_in
    );

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: newExpiresAt,
      user: {
        id: payload.sub || null,
        username: payload.preferred_username || null,
        email: payload.email || null,
        roles: [
          ...(payload.realm_access?.roles || []),
          ...(payload.resource_access?.[process.env.KEYCLOAK_ID!]?.roles || []),
        ],
      },
    };
  } catch (error) {
    console.log("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const handler = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
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

      // Initial sign in
      if (account) {
        token.accessToken = account.access_token!;
        token.refreshToken = account.refresh_token!;
        token.expiresAt = account.expires_at!;

        const payload = JSON.parse(
          Buffer.from(account.access_token!.split(".")[1], "base64").toString()
        );

        token.user = {
          id: payload.sub || null,
          username: payload.preferred_username || null,
          email: payload.email || null,
          roles: [
            ...(payload.realm_access?.roles || []),
            ...(payload.resource_access?.[process.env.KEYCLOAK_ID!]?.roles ||
              []),
          ],
        };

        return token;
      }

      // Check if we have an error from previous refresh attempt
      if (token.error) {
        console.log("Previous refresh error detected:", token.error);
        return token;
      }

      // Check token expiration
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = token.expiresAt - currentTime;

      if (timeUntilExpiry < 300) {
        
        return await refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      if (token.error) {
        session.error = token.error;
      }

      session.user = token.user as {
        id: string | null;
        username: string | null;
        email: string | null;
        roles: string[];
      };
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.accessTokenExpires = token.expiresAt as number;

      return session;
    },
  },
  debug: true,
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
