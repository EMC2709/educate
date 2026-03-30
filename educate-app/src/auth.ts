import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER || 'https://login.microsoftonline.com/common/v2.0',
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = 'student'; // Default role; future: look up from DB
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role ?? 'student';
      }
      return session;
    },
  },
});
