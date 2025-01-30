import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Notes from "@/models/notes";
import jwt, { JwtPayload } from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
    try {

        const token = req.cookies.get(process.env.NEXT_TOKEN as string)?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized Token." }, { status: 401 });
        }
        await connectDB();
        const jwtSecret = process.env.JWT_SECRET as string;

        // Decode the token
        let decoded: JwtPayload | string;

        try {
            decoded = jwt.verify(token, jwtSecret);
            // console.log("Decoded Token:", decoded);
        } catch (error) {
            console.error("JWT Verification Failed:", error);
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        if (typeof decoded === 'string') {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const user_id = decoded.user_id;

        const userSubjectsObject = await Notes.findOne({ user_id });

        if (!userSubjectsObject) {
            return NextResponse.json(
                { success: false, message: "No notes found for this user" },
                { status: 404 }
            );
        }

        return NextResponse.json(userSubjectsObject, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching user notes:", error.message);
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
};