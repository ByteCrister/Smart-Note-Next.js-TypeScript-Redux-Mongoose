import { NextResponse } from "next/server";

export const POST = async () => {
    try {
        const response = NextResponse.json({
            message: 'Sign Out successfully.',
            success: true
        });

        response.cookies.set(process.env.NEXT_TOKEN as string, '', { httpOnly: true, expires: new Date(0) });
        return response;
    } catch (error) {
        console.error("Error during sign-out:", error);
        return NextResponse.json({ message: "Failed to sign out!" }, { status: 500 });
    }
};