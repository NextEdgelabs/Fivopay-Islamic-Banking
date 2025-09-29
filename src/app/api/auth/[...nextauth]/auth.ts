import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

// Custom logger to suppress some noisy logs in development
const customLogger = {
  error: (code: any, metadata: any) => {
    // Suppress the JWT session error that occurs on first load
    if (code?.toString()?.includes('JWT_SESSION_ERROR')) {
      return;
    }
    console.error('[NextAuth Error]', code, metadata);
  },
  warn: (code: any) => {
    console.warn('[NextAuth Warn]', code);
  },
  debug: () => {
    // Suppress debug logs in production
    if (process.env.NODE_ENV === 'development') {
      // console.debug('[NextAuth Debug]', ...args);
    }
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.email === "admin@fivopay.com" && credentials.password === "password") {
            return { 
              id: "1", 
              name: "Admin", 
              email: "admin@fivopay.com", 
              role: "admin" 
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = (user as any).role
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user && token.role) {
          (session.user as any).role = token.role as string;
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === 'development',
  logger: customLogger,
}

export default NextAuth(authOptions)
