"use client"

import { MdOutlineAutoDelete } from "react-icons/md";
import { ToastAction } from "../../ui/toast";
import { Button } from "../../ui/button";
import { useToast } from "@/hooks/use-toast";
import Toaster from "@/services/common/Toaster";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { deleteNote } from "@/lib/features/notes/noteSlice";

interface propTypes { NoteIndex: number; }
export default function DeleteNotes({ NoteIndex }: propTypes) {
    const { toast } = useToast()

    const dispatch = useAppDispatch();
    const { selectedSubjectIndex } = useAppSelector(state => state.noteStore);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/api/notes/note`, { data: { subjectIndex: selectedSubjectIndex, noteIndex: NoteIndex }, withCredentials: true });
            dispatch(deleteNote(NoteIndex));
            Toaster(response.data.message, "success");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error);
                const serverError = (error as { response?: { data?: { message: string } } }).response?.data;
                Toaster(serverError?.message || error.message, 'error');
            }
        }
    };

    return (
        <Button
            onClick={() => {
                toast({
                    title: "Do want to delete this?",
                    description: "This note will be deleted permanently.",
                    className: "backdrop-blur rounded-xl text-white border-none shadow-xl",
                    action: (
                        <ToastAction onClick={handleDelete} altText="Goto schedule to undo" className="rounded-md shadow-sm">Confirm Delete</ToastAction>
                    ),
                })
            }}
        >
            <div className="flex justify-between items-center gap-2 "><span>Delete</span> <MdOutlineAutoDelete className="text-lg" /></div>
        </Button>
    )
};