import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"
import { Buffer } from "buffer"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null
      username: string | null
      email: string | null
      roles: string[]
    }
    accessTokenExpires: number
    accessToken: string
    refreshToken: string
    error?: string
  }
  interface User {
    id: string | null
    username: string | null
    roles: string[]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    expiresAt: number
    error?: string
    user?: {
      // Add this
      id: string | null
      username: string | null
      email: string | null
      roles: string[]
    }
  }
}

interface RefreshTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  error?: string
  error_description?: string
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  console.log("[v0] Attempting to refresh token. Current expiry:", new Date(token.expiresAt * 1000).toISOString())

  try {
    const url = `${process.env.KEYCLOAK_TOKEN_ENDPOINT}`

    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_ID!,
        client_secret: process.env.KEYCLOAK_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    })

    const refreshedTokens: RefreshTokenResponse = await response.json()

    if (!response.ok) {
      console.error("[v0] Token refresh failed:", refreshedTokens)
      throw refreshedTokens
    }

    const payload = JSON.parse(Buffer.from(refreshedTokens.access_token.split(".")[1], "base64").toString())

    const newExpiresAt = Math.floor(Date.now() / 1000 + refreshedTokens.expires_in)

    console.log("[v0] Token refreshed successfully. New expiry:", new Date(newExpiresAt * 1000).toISOString())

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: newExpiresAt,
      error: undefined,
      user: {
        id: payload.sub || null,
        username: payload.preferred_username || null,
        email: payload.email || null,
        roles: [
          ...(payload.realm_access?.roles || []),
          ...(payload.resource_access?.[process.env.KEYCLOAK_ID!]?.roles || []),
        ],
      },
    }
  } catch (error) {
    console.error("[v0] Error refreshing access token:", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
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
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token!
        token.refreshToken = account.refresh_token!
        token.expiresAt = account.expires_at!

        const payload = JSON.parse(Buffer.from(account.access_token!.split(".")[1], "base64").toString())

        token.user = {
          id: payload.sub || null,
          username: payload.preferred_username || null,
          email: payload.email || null,
          roles: [
            ...(payload.realm_access?.roles || []),
            ...(payload.resource_access?.[process.env.KEYCLOAK_ID!]?.roles || []),
          ],
        }

        return token
      }

      if (trigger === "update" && token.error) {
        console.log("[v0] Manual update triggered, attempting to recover from error")
        const currentTime = Math.floor(Date.now() / 1000)
        const timeUntilExpiry = token.expiresAt - currentTime

        if (timeUntilExpiry < 0) {
          return await refreshAccessToken(token)
        }
      }

      // Check if we have an error from previous refresh attempt
      if (token.error) {
        console.log("[v0] Previous refresh error detected:", token.error)
        return token
      }

      const currentTime = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = token.expiresAt - currentTime

      console.log("[v0] Time until token expiry:", timeUntilExpiry, "seconds")

      if (timeUntilExpiry < 600) {
        console.log("[v0] Token expiring soon, refreshing...")
        return await refreshAccessToken(token)
      }

      return token
    },

    async session({ session, token }) {
      if (token.error) {
        session.error = token.error
      }

      session.user = token.user as {
        id: string | null
        username: string | null
        email: string | null
        roles: string[]
      }
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.accessTokenExpires = token.expiresAt as number

      return session
    },
  },

  events: {
    async signOut({ token }) {
      console.log("[v0] Sign out event triggered, revoking tokens on Keycloak...")
      if (token?.refreshToken) {
        try {
          const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.KEYCLOAK_ID!,
              client_secret: process.env.KEYCLOAK_SECRET!,
              refresh_token: token.refreshToken as string,
            }),
          })

          if (response.ok) {
            console.log("[v0] Tokens successfully revoked on Keycloak")
          } else {
            console.error("[v0] Failed to revoke tokens:", await response.text())
          }
        } catch (error) {
          console.error("[v0] Error revoking token:", error)
        }
      }
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  debug: true,
  secret: process.env.AUTH_SECRET,
})

export { handler as GET, handler as POST }
