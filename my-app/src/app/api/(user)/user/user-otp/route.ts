import { emailAuthentication } from "@/config/modeMailer";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const email = req.nextUrl.searchParams.get('email');

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // Generate a 6-digit OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        const subject = 'OTP for user Authentication';
        const html = `<h1>Your 6 Digit OTP is : ${newOtp}</h1>`;

        await emailAuthentication(email, subject, html);

        return NextResponse.json(newOtp, { status: 200 });
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
