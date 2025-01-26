"use server";

import { Document } from "mongoose";

// * --------- Database: NotesSchema types  ----------
export interface userType {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    createdAt: Date,
    modifiedAt: Date
}

interface Note {
    note: string;
    createdAt: Date;
    modifiedAt: Date;
}

interface Subject {
    name: string;
    notes: Note[];
    createdAt: Date;
    modifiedAt: Date;
}

export interface noteType extends Document {
    user_id: string;
    subjects: Subject[];
}

// * ------------ end --------------