import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";


declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string | null;
    };
  }
}
const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      console.log("SESSION CALLBACK", session, token);
      session.user = session.user || {};
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin", // Optional custom sign-in page
  },
});

export default handler;