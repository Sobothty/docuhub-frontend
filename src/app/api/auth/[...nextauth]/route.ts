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
  console.log("=== REFRESH TOKEN FUNCTION CALLED ===");
  console.log(
    "Current token expiry:",
    new Date(token.expiresAt * 1000).toISOString()
  );
  console.log("Current time:", new Date().toISOString());
  console.log("Has refresh token:", !!token.refreshToken);

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

    const refreshedTokens : RefreshTokenResponse = await response.json();
    console.log("Refresh response status:", response.status);
    console.log("Refresh response:", response.ok ? "Success" : refreshedTokens);

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
    console.log(
      "New token expiry:",
      new Date(newExpiresAt * 1000).toISOString()
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
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

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
    async jwt({ token, account, trigger }) {
      console.log("=== JWT Callback ===");
      console.log("Trigger:", trigger);
      console.log("Account exists:", !!account);
      console.log("Token exists:", !!token);

      // Initial sign in
      if (account) {
        console.log("Initial sign in - setting tokens");
        console.log("Access token exists:", !!account.access_token);
        console.log("Refresh token exists:", !!account.refresh_token);
        console.log("Expires at:", account.expires_at);

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

        console.log(
          "Token will expire at:",
          new Date(token.expiresAt * 1000).toISOString()
        );
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

      console.log("Current time (unix):", currentTime);
      console.log("Token expires at (unix):", token.expiresAt);
      console.log("Time until expiry (seconds):", timeUntilExpiry);
      console.log("Token has accessToken:", !!token.accessToken);
      console.log("Token has refreshToken:", !!token.refreshToken);
      
      if (timeUntilExpiry < 300) {
        console.log("🔄 Token expired or about to expire (< 5 min), refreshing...");
        return await refreshAccessToken(token);
      }

      console.log("✅ Access token still valid");
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

      console.log("Session has accessToken:", !!session.accessToken);
      console.log(
        "Session expires at:",
        new Date(session.accessTokenExpires * 1000).toISOString()
      );

      return session;
    },
  },
  debug: true,
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
