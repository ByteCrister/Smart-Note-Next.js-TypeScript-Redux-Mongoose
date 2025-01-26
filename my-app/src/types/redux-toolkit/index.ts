"use client";

export interface Note {
    note: string;
    createdAt: string;
    modifiedAt: string;
}

export interface Subject {
    name: string;
    notes: Note[];
    createdAt: string;
    modifiedAt: string;
}

export interface NoteState {
    user_id: string;
    subjects: Subject[];
    filteredSubjects: Subject[]
    status: string,
    error: string
}