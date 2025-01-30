import connectDB from "@/config/connectDB";
import Notes from "@/models/notes";
import { ServerGetUserIdFromToken } from "@/services/helper/server/ServerGetUserIdFromToken";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { subjectIndex, note } = await req.json();

        // Validate input
        if (typeof subjectIndex !== "number" || subjectIndex < 0) {
            return NextResponse.json({ message: "Invalid subject index." }, { status: 400 });
        }
        if (typeof note !== "string" || note.trim() === "") {
            return NextResponse.json({ message: "Note cannot be empty." }, { status: 400 });
        }
        await connectDB();
        const user_id = ServerGetUserIdFromToken(req);

        const userNotes = await Notes.findOne({ user_id });
        if (!userNotes) {
            return NextResponse.json({ message: "User does not exist!" }, { status: 401 });
        }
        userNotes.subjects[subjectIndex].notes.unshift({ note: note, updatedAt: new Date().toISOString() });
        await userNotes.save();

        return NextResponse.json({ message: "Note created Successfully" }, { status: 201 });

    } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
};

export const PATCH = async (req: NextRequest) => {
    try {
        const { note, SubjectIndex, NoteIndex } = await req.json();

        if (!note || SubjectIndex === undefined || NoteIndex === undefined) {
            return NextResponse.json({ message: 'note and indexes are required' }, { status: 400 });
        }

        await connectDB();

        const user_id = await ServerGetUserIdFromToken(req);

        const updatedSubject = await Notes.findOneAndUpdate(
            { user_id },
            {
                $set: {
                    [`subjects.${SubjectIndex}.notes.${NoteIndex}.note`]: note,
                    [`subjects.${SubjectIndex}.notes.${NoteIndex}.updatedAt`]: new Date().toISOString(),
                    [`subjects.${SubjectIndex}.updatedAt`]: new Date().toISOString(),
                },
            },
            { new: true }
        );

        if (!updatedSubject) {
            return NextResponse.json({ message: 'Subject not found or update failed' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Note updated successfully', data: updatedSubject });
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
        const { subjectIndex, noteIndex } = await req.json();

        // Validate indices
        if (typeof subjectIndex !== "number" || typeof noteIndex !== "number") {
            return NextResponse.json({ message: "Valid subjectIndex and noteIndex are required" }, { status: 400 });
        }

        await connectDB();
        const user_id = await ServerGetUserIdFromToken(req);

        const userNotes = await Notes.findOne({ user_id });
        if (!userNotes) {
            return NextResponse.json({ message: "User notes not found" }, { status: 404 });
        }

        if (!userNotes.subjects[subjectIndex]) {
            return NextResponse.json({ message: "Subject not found" }, { status: 404 });
        }

        if (!userNotes.subjects[subjectIndex].notes[noteIndex]) {
            return NextResponse.json({ message: "Note not found" }, { status: 404 });
        }

        // Remove the note using $pull (no need for $unset)
        const updatedDocument = await Notes.findOneAndUpdate(
            { user_id },
            { $pull: { [`subjects.${subjectIndex}.notes`]: userNotes.subjects[subjectIndex].notes[noteIndex] } },
            { new: true }
        );

        return NextResponse.json({ message: "Note deleted successfully", data: updatedDocument });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
};