import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Notes from "@/models/notes";
import User from "@/models/user";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { first_name, last_name, email, password } = body;

        // Hash the password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

        // Save the user
        const savedUser = await newUser.save();

        // Create the user-specific notes
        const newNotes = new Notes({
            user_id: savedUser._id,
            subjects: [],
        });
        await newNotes.save();

        // Create a JWT token with user data (e.g., user_id )
        const jwtSecret = process.env.JWT_SECRET as string;
        const token = jwt.sign(
            { user_id: savedUser._id },
            jwtSecret,
            { expiresIn: "30d" }
        );

        // Set the JWT token in a cookie
        const serializedCookie = cookie.serialize(process.env.NEXT_TOKEN as string, token, {
            httpOnly: true, // This prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Ensure the cookie is only sent over HTTPS in production
            sameSite: "strict", // Prevents cross-site request forgery (CSRF)
            maxAge: 30 * 24 * 60 * 60, // Cookie expiry (30 days)
            path: "/",
        });

        // Send the response with the cookie
        return NextResponse.json(
            { message: "User created successfully!" },
            {
                status: 201,
                headers: {
                    "Set-Cookie": serializedCookie, // Add cookie to the response headers
                },
            }
        );

    } catch (error: any) {
        console.log(error);
        if (error instanceof AxiosError) {
            return NextResponse.json({ message: error.message || "Internal server error!" }, { status: 500 });
        } else {
            return NextResponse.json({ message: "An error occurred!" }, { status: 500 });
        }
    }
};
