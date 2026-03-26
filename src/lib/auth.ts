import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const secret = process.env.AUTH_SECRET;
if (!secret) throw new Error('AUTH_SECRET env var is required');

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
          return null;
        }

        if (credentials?.email === process.env.ADMIN_EMAIL && typeof credentials?.password === 'string') {
          const isValid = await bcrypt.compare(credentials.password, process.env.ADMIN_PASSWORD_HASH);
          if (isValid) {
            return { id: "admin", name: "Administrador", email: credentials.email };
          }
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redireciona para o login em caso de callback false/erro
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
    signIn: ({ user, account, profile }) => {
      if (account?.provider === "google") {
        return profile?.email?.endsWith("@matrixenergia.com") || false;
      }
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
  },
});
