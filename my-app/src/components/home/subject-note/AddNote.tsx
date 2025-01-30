"use client";

import * as React from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import Toaster from "@/services/common/Toaster";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addNote } from "@/lib/features/notes/noteSlice";

export default function AddNote() {

    const [noteName, setNoteName] = React.useState<string>("");
    const dispatch = useAppDispatch();
    const { selectedSubjectIndex } = useAppSelector(state => state.noteStore);

    const handleSubjectForm = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/notes/note`, { subjectIndex: selectedSubjectIndex, note: noteName }, { withCredentials: true });
            dispatch(addNote(noteName));
            Toaster("Note added successfully", "success");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);

                const serverError = (error as { response?: { data?: { message: string } } }).response?.data;
                Toaster(serverError?.message || error.message, "error");
            }
        }
    };

    const SubjectForm = (): React.ReactElement => {
        return (
            <form onSubmit={(e) => handleSubjectForm(e)} className="flex flex-col gap-2" >
                <input
                    type="text"
                    id="note"
                    name="note"
                    value={noteName}
                    onChange={(e) => setNoteName(e.target.value)}
                    placeholder="Type your note..."
                    className="bg-transparent outline-none text-slate-200 font-bold px-3 py-1 rounded-md"
                    autoFocus
                    required
                />
                <button
                    type="submit"
                    className="bg-slate-600 text-white p-2 rounded hover:bg-slate-700 shadow transition duration-300 ease-in-out"
                >
                    Add
                </button>
            </form>
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="backdrop-blur-sm text-slate-300 drop-shadow-xl font-semibold px-3 py-2 rounded-xl shadow-md hover:shadow-lg hover:border-spacing-1 hover:border-slate-400"
                    >
                    +Add Note
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" border-0 px-3 py-2 backdrop-blur-sm rounded-lg flex flex-col items-center gap-2">
                <DropdownMenuLabel className="text-lg text-slate-700 font-sans font-semibold">
                    Create New Note
                </DropdownMenuLabel>
                <SubjectForm />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};