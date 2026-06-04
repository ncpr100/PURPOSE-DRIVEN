import { NextAuthOptions } from "next-auth";
export const authOptions: NextAuthOptions = {
  providers: [],
  callbacks: {
    async session({ session, token }: any) {
      if (token?.sub) session.user.id = token.sub;
      return session;
    },
  },
};
export { getServerSession } from "next-auth/next";
