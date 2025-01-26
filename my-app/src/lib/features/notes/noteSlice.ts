"use client";

import { FAILED, LOADING, SUCCEEDED } from "@/services/helper/constans";
import { NoteState, Subject } from "@/types/redux-toolkit";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: NoteState = {
    user_id: "",
    subjects: [
        {
            name: "sub1",
            notes: [
                {
                    note: "note1",
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString(),
                },
                {
                    note: "note2",
                    createdAt: new Date().toISOString(),
                    modifiedAt: new Date().toISOString(),
                },
            ],
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
        },
        {
            name: "sub2",
            notes: [],
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
        },
    ],
    filteredSubjects: [],
    status: "",
    error: "",
};


export const fetchNotes = createAsyncThunk(
    "notes/fetchNotes",
    async () => {
        const response = await axios.get(`/api/notes`);
        return response.data;
    }
);

const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        addSubject: (state, action: PayloadAction<string>) => {
            const timestamp = new Date().toISOString();
            state.subjects.push({
                name: action.payload,
                notes: [],
                createdAt: timestamp,
                modifiedAt: timestamp,
            });
        },
        deleteSubject: (state, action: PayloadAction<number>) => {
            state.subjects = state.subjects.filter((_, index) => index !== action.payload);
        },
        addNote: (state, action: PayloadAction<{ subjectIndex: number; note: string }>) => {
            const { subjectIndex, note } = action.payload;
            const targetSubject = state.subjects.find((_, index) => index === subjectIndex);
            if (targetSubject) {
                const timestamp = new Date().toISOString();
                targetSubject.notes.push({
                    note,
                    createdAt: timestamp,
                    modifiedAt: timestamp,
                });
                targetSubject.modifiedAt = timestamp; // Update the subject's modifiedAt
            }
        },
        updateNote: (state, action: PayloadAction<{ subjectIndex: number; noteIndex: number; newNote: string }>) => {
            const { subjectIndex, noteIndex, newNote } = action.payload;
            const targetSubject = state.subjects.find((_, index) => index === subjectIndex);
            if (targetSubject && targetSubject.notes[noteIndex]) {
                const targetNote = targetSubject.notes[noteIndex];
                targetNote.note = newNote;
                targetNote.modifiedAt = new Date().toISOString();
                targetSubject.modifiedAt = new Date().toISOString(); // Update the subject's modifiedAt
            }
        },
        deleteNote: (state, action: PayloadAction<{ subjectIndex: number; noteIndex: number }>) => {
            const { subjectIndex, noteIndex } = action.payload;
            const targetSubject = state.subjects.find((_, index) => index === subjectIndex);
            if (targetSubject) {
                targetSubject.notes.splice(noteIndex, 1);
                targetSubject.modifiedAt = new Date().toISOString(); // Update the subject's modifiedAt
            }
        },
        setFilteredSubjects: (state, action: PayloadAction<Subject[]>) => {
            state.filteredSubjects = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = LOADING;
                state.error = '';
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = SUCCEEDED;
                state.subjects = action.payload.subjects;
                state.user_id = action.payload.user_id;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = FAILED;
                state.error = action.error.message || "Failed to fetch notes";
            });
    },
});

export const {
    addSubject,
    deleteSubject,
    addNote,
    updateNote,
    deleteNote,
    setFilteredSubjects
} = noteSlice.actions;

export default noteSlice;
