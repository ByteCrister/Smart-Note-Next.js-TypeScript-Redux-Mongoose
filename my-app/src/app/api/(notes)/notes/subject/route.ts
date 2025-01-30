import connectDB from "@/config/connectDB";
import Notes from "@/models/notes";
import { ServerGetUserIdFromToken } from "@/services/helper/server/ServerGetUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { subjectName } = await req.json();

        await connectDB();
        const user_id = ServerGetUserIdFromToken(req);

        const userNotes = await Notes.findOne({ user_id });
        if (!userNotes) {
            return NextResponse.json({ message: "User does not exist!" }, { status: 401 });
        }

        userNotes.subjects.unshift({ name: subjectName, notes: [], updatedAt: new Date().toISOString() });
        await userNotes.save();

        return NextResponse.json({ message: "Subject created Successfully" }, { status: 201 });

    } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
};

export const PATCH = async (req: NextRequest) => {
    try {
        const { name, index } = await req.json();
        console.log(name);

        if (!name || index === undefined) {
            return NextResponse.json({ message: 'Name and index are required' }, { status: 400 });
        }

        await connectDB();

        const user_id = await ServerGetUserIdFromToken(req);

        const updatedSubject = await Notes.findOneAndUpdate(
            { user_id },
            {
                $set: {
                    [`subjects.${index}.name`]: name,
                    [`subjects.${index}.updatedAt`]: new Date().toISOString(),
                },
            },
            { new: true } // Return the updated document
        );

        if (!updatedSubject) {
            return NextResponse.json({ message: 'Subject not found or update failed' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Subject updated successfully', data: updatedSubject });
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const { index } = await req.json();

        if (index === undefined) {
            return NextResponse.json({ message: "Index is required" }, { status: 400 });
        }

        await connectDB();
        const user_id = await ServerGetUserIdFromToken(req);

        // Step 1: $unset to remove the element at the index
        await Notes.updateOne(
            { user_id },
            { $unset: { [`subjects.${index}`]: 1 } }
        );

        // Step 2: $pull to remove null values left by $unset
        const updatedDocument = await Notes.findOneAndUpdate(
            { user_id },
            { $pull: { subjects: null } },
            { new: true }
        );

        if (!updatedDocument) {
            return NextResponse.json({ message: "Subject not found or could not be deleted" }, { status: 404 });
        }

        return NextResponse.json({ message: "Subject deleted successfully", data: updatedDocument });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
};