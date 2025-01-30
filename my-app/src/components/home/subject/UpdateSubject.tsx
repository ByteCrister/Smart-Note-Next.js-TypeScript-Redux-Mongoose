"use client";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import Toaster from "@/services/common/Toaster";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks";
import { updateSubject } from "@/lib/features/notes/noteSlice";

interface SelectedSubjectTypes { SubjectName: string; Index: number; }

export default function UpdateSubject({ SubjectName, Index }: SelectedSubjectTypes) {

    const [dialogState, setDialogState] = useState<boolean>(false);
    const [newSubjectName, setNewSubjectName] = useState<string>(SubjectName);

    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/notes/subject`, { name: newSubjectName, index: Index }, { withCredentials: true });
            dispatch(updateSubject({ subject: newSubjectName, index: Index }));
            setDialogState(false);
            Toaster("Subject updated successfully", "success");
        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                const serverError = (error as { response?: { data?: { message: string } } }).response?.data;
                Toaster(serverError?.message || error.message, "error");
            }
        }
    };

    return (
        <Dialog open={dialogState} onOpenChange={setDialogState}>
            <DialogTrigger asChild>
                <Button className="shadow hover:shadow-md bg-transparent">Edit <FaEdit /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] backdrop-blur-xl border-none rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center text-slate-300 font-bold text-lg">Edit Subject</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-2">
                    <Input
                        id="name"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        placeholder={"Subject..."}
                        required
                        className="w-full outline-none text-slate-400 rounded-md px-2 py-1"
                    />
                    <DialogFooter className="w-full">
                        <Button type="submit" className="w-full shadow-md text-slate-300 text-lg font-semibold">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};