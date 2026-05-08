import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
            return null
        }
        
        let user = await prisma.user.findUnique({
            where: { email: credentials.email }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: credentials.email,
                    name: credentials.email.split('@')[0],
                    role: 'USER'
                }
            })
        }

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  callbacks: {
      async session({ session, token }: any) {
          if (session.user && token.sub) {
              (session.user as any).id = token.sub;
              (session.user as any).role = token.role;
          }
          return session;
      },
      async jwt({ token, user }: any) {
          if (user) {
              token.role = (user as any).role;
          }
          return token;
      }
  },
  session: {
      strategy: "jwt" as const
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development"
};
