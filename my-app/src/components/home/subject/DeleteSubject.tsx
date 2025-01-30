"use client"

import { MdOutlineAutoDelete } from "react-icons/md";
import { ToastAction } from "../../ui/toast";
import { Button } from "../../ui/button";
import { useToast } from "@/hooks/use-toast";
import Toaster from "@/services/common/Toaster";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks";
import { deleteSubject } from "@/lib/features/notes/noteSlice";

interface propTypes { Index: number; }
export default function DeleteSubject({ Index }: propTypes) {
    const { toast } = useToast()
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/api/notes/subject`, { data: { index: Index }, withCredentials: true });
            dispatch(deleteSubject(Index));
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
                    description: "All notes of this subject will also deleted.",
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
}
