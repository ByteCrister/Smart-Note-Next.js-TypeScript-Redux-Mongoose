import { NextRequest, NextResponse } from "next/server";
import { ServerGetUserIdFromToken } from "@/services/helper/server/ServerGetUserIdFromToken";


export const POST = async (req: NextRequest) => {
    try {
        const user_id = ServerGetUserIdFromToken(req);
        return NextResponse.json({ message: "User authenticated", user_id });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("Error:", error.message);
            return NextResponse.json({ message: error.message }, { status: 401 });
        } else {
            console.log("Unexpected error:", error);
            return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
        }
    }
};