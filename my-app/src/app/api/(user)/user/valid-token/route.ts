import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
    try {
        const token = req.cookies.get(process.env.NEXT_TOKEN as string)?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const jwtSecret = process.env.JWT_SECRET as string;
        jwt.verify(token, jwtSecret); // * Throws an error if invalid

        return NextResponse.json({ message: "Token is valid", token: token }, { status: 200 });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
};