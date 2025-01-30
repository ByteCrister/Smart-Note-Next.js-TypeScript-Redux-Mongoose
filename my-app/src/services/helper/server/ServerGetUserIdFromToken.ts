import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const ServerGetUserIdFromToken = (req: NextRequest) => {
    const token = req.cookies.get(process.env.NEXT_TOKEN as string)?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized token" }, { status: 401 });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET as string;
        // Decode the token with the correct type assertion
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload | string;
        console.log(decoded);

        if (typeof decoded === 'string') {
            throw new Error("Invalid token");
        }
        return decoded.user_id; // Extract user_id from the decoded token
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error("Invalid or expired token");
        }
    }
};