"use client";

import { FAILED, LOADING, SUCCEEDED } from "@/services/helper/common/constants";
import getFetchNotes from "@/services/helper/REST-API/getFetchNotes";
import { NoteState } from "@/types/redux-toolkit";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

// const initialState: NoteState = {
//     user_id: "",
//     subjects: [
//         {
//             name: "sub1",
//             notes: [
//                 {
//                     note: "note1",
//                     createdAt: new Date().toISOString(),
//                     modifiedAt: new Date().toISOString(),
//                 },
//                 {
//                     note: "note2",
//                     createdAt: new Date().toISOString(),
//                     modifiedAt: new Date().toISOString(),
//                 },
//             ],
//             createdAt: new Date().toISOString(),
//             modifiedAt: new Date().toISOString(),
//         },
//         {
//             name: "sub2",
//             notes: [],
//             createdAt: new Date().toISOString(),
//             modifiedAt: new Date().toISOString(),
//         },
//     ],
//     filteredSubjects: [],
//     status: "",
//     error: "",
// };
const initialState: NoteState = {
    user_id: "",
    subjects: [],
    selectedSubjectIndex: null,
    status: "",
    error: "",
    token: "",
};


export const fetchNotes = createAsyncThunk(
    "notes/fetchNotes",
    async (token: string) => {
        const responseData = await getFetchNotes(token);
        return responseData;
    }
);

const noteSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        addSubject: (state, action: PayloadAction<string>) => {
            const timestamp = new Date().toISOString();
            state.subjects.unshift({
                name: action.payload,
                notes: [],
                createdAt: timestamp,
                updatedAt: timestamp,
            });
        },
        deleteSubject: (state, action: PayloadAction<number>) => {
            state.subjects = state.subjects.filter((_, index) => index !== action.payload);
        },
        updateSubject: (state, action: PayloadAction<{ subject: string, index: number }>) => {
            state.subjects = state.subjects.map((item, index) => index === action.payload.index ? { ...item, name: action.payload.subject, updatedAt: new Date().toISOString() } : item);
        },
        addNote: (state, action: PayloadAction<string>) => {
            const timestamp = new Date().toISOString();
            state.subjects[state.selectedSubjectIndex ? state.selectedSubjectIndex : 0].notes.unshift({
                note: action.payload,
                createdAt: timestamp,
                updatedAt: timestamp,
            });
            state.subjects[state.selectedSubjectIndex ? state.selectedSubjectIndex : 0].updatedAt = timestamp;
        },
        updateNote: (state, action: PayloadAction<{ noteIndex: number; newNote: string }>) => {
            state.subjects[state.selectedSubjectIndex ? state.selectedSubjectIndex : 0].notes = state.subjects[state.selectedSubjectIndex ? state.selectedSubjectIndex : 0].notes.map((note, index) => {
                return action.payload.noteIndex === index ? { ...note, note: action.payload.newNote, updatedAt: new Date().toISOString() } : note
            });
        },
        deleteNote: (state, action: PayloadAction<number>) => {
            state.subjects[state.selectedSubjectIndex ? state.selectedSubjectIndex : 0].notes = state.subjects[state.selectedSubjectIndex ? state.selectedSubjectIndex : 0].notes.filter((item, index) => {
                return action.payload !== index
            });
        },
        setSelectedSubjectIndex: (state, action: PayloadAction<number | null>) => {
            // console.log(action.payload);
            state.selectedSubjectIndex = action.payload;
            // console.log(state.selectedSubjectIndex);
        },
        setStateClear: (state) => {
            state.user_id = "";
            state.subjects = [];
            state.selectedSubjectIndex = null;
            state.status = "";
            state.error = "";
            state.token = "";
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
    updateSubject,
    deleteNote,
    setSelectedSubjectIndex,
    setStateClear,
} = noteSlice.actions;

export default noteSlice;