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
import { useAppDispatch } from "@/lib/hooks";
import { addSubject } from "@/lib/features/notes/noteSlice";

export default function AddSubject() {

    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [subjectName, setSubjectName] = React.useState<string>("");

    const dispatch = useAppDispatch();

    const handleSubjectForm = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/notes/subject`, { subjectName }, { withCredentials: true });
            dispatch(addSubject(subjectName));
            Toaster("Subject added successfully", "success");
            setIsOpen(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
                const serverError = (error as { response?: { data?: { message: string } } }).response?.data;
                Toaster(serverError?.message || error.message, "error");
            }
        }
    };

    const SubjectForm = (): React.ReactElement => (
        <form onSubmit={(e) => handleSubjectForm(e)} className="flex flex-col gap-2">
            <input
                type="text"
                name="subject"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Subject..."
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

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    className="backdrop-blur-sm text-slate-300 drop-shadow-xl font-semibold px-3 py-2 rounded-xl shadow-md hover:shadow-lg hover:border-spacing-1 hover:border-slate-400"
                >
                    +Add Subjects
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-0 px-3 py-2 backdrop-blur-sm rounded-lg flex flex-col items-center gap-2">
                <DropdownMenuLabel className="text-lg text-slate-700 font-sans font-semibold">
                    Create New Subject
                </DropdownMenuLabel>
                <SubjectForm />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
