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
        if (credentials?.email === "admin@fivopay.com" && credentials.password === "password") {
          return { 
            id: "1", 
            name: "Admin", 
            email: "admin@fivopay.com", 
            role: "admin" 
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token.role) {
        (session.user as any).role = token.role as string;
      }
      return session
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
  debug: false, // Disable debug to reduce console noise
  logger: customLogger,
}

export default NextAuth(authOptions)
