import connectDB from "@/config/connectDB";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();
        const body = await req.json();
        const isUserExist = await User.findOne({ email: body.email });
        if (isUserExist)
            return NextResponse.json(
                { success: false, message: "User email already exists!" },
                { status: 400 }
            );
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error!" }, { status: 500 });
    }
}