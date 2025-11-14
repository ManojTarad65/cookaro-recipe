import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // 🔥 FIXES OAuthAccountNotLinked error
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt", // 🔥 Best for Next.js 13–15
  },

  callbacks: {
    async jwt({ token, account, profile }: any) {
      // When user signs in
      if (account) {
        token.provider = account.provider;

        // Google login gives profile info
        if (profile) {
          token.email = profile.email;
          token.name = profile.name;
          token.picture = profile.picture;
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      // Pass JWT data to frontend session
      if (session.user) {
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
        session.user.image = token.picture ?? "";
        session.user.provider = token.provider ?? "";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
