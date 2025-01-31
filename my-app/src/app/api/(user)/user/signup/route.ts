import { NextRequest, NextResponse } from "next/server";
import { AxiosError } from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Notes from "@/models/notes";
import User from "@/models/user";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const { first_name, last_name, email, password } = body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        const newNotes = new Notes({
            user_id: savedUser._id,
            subjects: [],
        });
        await newNotes.save();

        // Create token payload
        const tokenPayload = {
            user_id: savedUser._id
        };

        // Generate JWT token
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, { expiresIn: '30d' });

        // Set response with token in cookies
        const response = NextResponse.json({ message: 'Successful Signed Up.' }, {status: 200});
        response.cookies.set(process.env.NEXT_TOKEN as string, token, {
            httpOnly: true,
            secure: true, // true for production with HTTPS
            sameSite: "lax", 
            path: "/",
            maxAge: 30 * 24 * 60 * 60, 
        });

        return response;
    } catch (error: unknown) {
        console.log(error);
        if (error instanceof AxiosError) {
            return NextResponse.json({ message: error.message || "Internal server error!" }, { status: 500 });
        } else {
            return NextResponse.json({ message: "An error occurred!" }, { status: 500 });
        }
    }
};