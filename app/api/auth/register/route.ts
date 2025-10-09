import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        const { email, password } = await request.json();

        if (!email || !email.includes("@") || !password || password.trim().length < 6) {
            return NextResponse.json(
                { message: "Invalid input - password should be at least 6 characters long." }, 
                { status: 422 }
            );
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists!" }, 
                { status: 422 }
            );
        }

        await User.create({ email, password });

        return NextResponse.json(
            { message: "User created!" }, 
            { status: 201 }
        );
    }
    catch (error) {
        console.error("Error during user registration:", error);
        return NextResponse.json(
            { message: "Something went wrong!", error: error instanceof Error ? error.message : "Unknown error" }, 
            { status: 500 }
        );
    }
}
