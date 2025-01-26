import { noteType } from "@/types/server";
import mongoose, { Schema } from "mongoose";

const NotesSchema: Schema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        subjects: [
            {
                name: { type: String, required: true },
                notes: [
                    {
                        note: { type: String, required: true },
                        createdAt: { type: Date, default: Date.now },
                        updatedAt: { type: Date, default: Date.now },
                    },
                ],
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Notes = mongoose.models.Notes || mongoose.model<noteType>("Notes", NotesSchema);

export default Notes;