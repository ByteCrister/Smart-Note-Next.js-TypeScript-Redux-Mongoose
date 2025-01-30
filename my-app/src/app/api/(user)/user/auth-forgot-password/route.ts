import connectDB from "@/config/connectDB";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        await connectDB();

        const isEmailExist = await User.findOne({ email: body.email });
        if (!isEmailExist) {
            return NextResponse.json({ message: "Email not found! Please try again.", success: false }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};