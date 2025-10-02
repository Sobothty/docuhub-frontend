import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

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
      if (account) {
        token.accessToken = account.access_token!;
        token.refreshToken = account.refresh_token!;

        const payload = JSON.parse(
          Buffer.from(account.access_token!.split(".")[1], "base64").toString()
        );

        token.user = {
          id: payload.sub || null,
          username: payload.preferred_username || null,
          email: payload.email || null,
          roles: [
            ...(payload.realm_access?.roles || []),
            ...(payload.resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]
              ?.roles || []),
          ],
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as {
        id: string | null;
        username: string | null;
        email: string | null;
        roles: string[];
      };
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.accessTokenExpires = token.exp as number;
      return session;
    },
  },
  debug: true,
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
