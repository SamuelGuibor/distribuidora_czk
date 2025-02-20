import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import { db } from "./prisma"
import { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
//import { EmailProvider } from "next-auth/providers/email"

export const authOptions: AuthOptions = {
  
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    //EmailProvider({}),
  ],

  //pegar o id do usuário que ta no banco e colocando no session
  callbacks: {
    async session({ session, user }) {
      // Inclui o id e o role do usuário na sessão
      session.user = {
        ...session.user,
        id: user.id,
        role: user.role, // Adiciona o campo role
      }
      return session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
}
