import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: {label: "Email", type: "text"},
            password: {label: "Password", type: "password"}
        },
        async authorize(credentials) {
            if(!credentials?.email || !credentials?.password) {
                throw new Error("Invalid credentials");
            }

            try {
                await connectToDatabase(); 
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found with the given email");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Incorrect password");
                }

                return { id: user._id.toString(), email: user.email };
            } catch (error) {
                console.error("Error during authentication:", error);
                throw new Error("Failed to authenticate user");
            }
        }
        
    })
    
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, user, token }) {
            if (session) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },

    pages:{
        signIn: "/login",
        error: "/login",
    },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
}