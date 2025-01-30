"use client";

export interface Note {
    note: string;
    createdAt: string;
    updatedAt: string;
}

export interface Subject {
    name: string;
    notes: Note[];
    createdAt: string;
    updatedAt: string;
}

export interface NoteState {
    user_id: string;
    token: string;
    subjects: Subject[];
    selectedSubjectIndex: number | null;
    status: string;
    error: string;
}