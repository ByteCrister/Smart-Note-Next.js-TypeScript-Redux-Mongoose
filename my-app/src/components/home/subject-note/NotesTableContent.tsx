"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table"

import { useState } from "react";
import { Note } from "@/types/redux-toolkit";
import PagePagination from "../../common/PagePagination";
import { setSelectedSubjectIndex } from "@/lib/features/notes/noteSlice";

import NoteSearch from "./NoteSearch";
import AddNote from "./AddNote";
import UpdateNotes from "./UpdateNotes";
import DeleteNotes from "./DeleteNotes";
import { LOADING } from "@/services/helper/common/constants";
import { SkeletonSearchNav, SkeletonTable } from "@/components/common/SkeletonComponent";

const NotesTableContent = () => {
    const { subjects, selectedSubjectIndex, status } = useAppSelector((state) => state.noteStore);
    const [Data, setData] = useState<Note[] | null>([...subjects[selectedSubjectIndex ? selectedSubjectIndex : 0].notes.slice(0, 5)]);
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useAppDispatch();

    const handleFilteredData = (newPaginateDate: unknown) => {
        if (Array.isArray(newPaginateDate)) {
            setData([...newPaginateDate]);
        } else {
            console.error("newPaginateDate is not an array:", newPaginateDate);
        }
    };

    const BackBtn = (): React.ReactElement => {
        return <button
            type="button"
            onClick={() => dispatch(setSelectedSubjectIndex(null))}
            className="backdrop-blur-sm text-slate-300 drop-shadow-xl font-semibold px-3 py-2 rounded-xl shadow-md hover:shadow-lg hover:border-spacing-1 hover:border-slate-400"
        >
            Back
        </button>
    }

    return (
        < >
            {
                status === LOADING ? <SkeletonSearchNav /> : <section className="w-full flex gap-2 justify-center items-center">
                    <BackBtn /> <NoteSearch setData={setData} /> <AddNote />
                </section>
            }
            {
                status === LOADING ? <SkeletonTable /> : <section className="w-[90%] md:w-[60%] relative bg-cover bg-center backdrop-blur-md rounded-xl">
                    <div className="absolute inset-0 bg-slate-400 opacity-15 rounded-xl"></div>
                    <div className="relative z-10 text-slate-100 p-8">
                        <Table>
                            <TableHeader className="backdrop-blur-sm rounded-xl border-b-0 mb-4">
                                <TableRow className="border-0 border-none">
                                    <TableHead className="text-center">No.</TableHead>
                                    <TableHead className="text-center" >Created</TableHead>
                                    <TableHead className="text-center" >Last Modified</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Data && Data.length > 0 && Data?.map((note, index) => (
                                    <TableRow className="border-stone-300 border-b" key={index}>

                                        <TableCell
                                            className="cursor-pointer hover:underline hover:underline-offset-1"
                                        >Note {currentPage > 1 ? index + 5 + 1 : index + 1}</TableCell>
                                        <TableCell >{new Date(note.createdAt).toLocaleString()}</TableCell>
                                        <TableCell >{new Date(note.updatedAt).toLocaleString()}</TableCell>
                                        <TableCell className="flex items-center gap-1"><UpdateNotes NoteIndex={currentPage * index} NoteName={note.note} /> <DeleteNotes NoteIndex={currentPage * index} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            }

            <PagePagination
                MainData={subjects[selectedSubjectIndex ? selectedSubjectIndex : 0].notes}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleFilteredData={handleFilteredData} />
        </>
    )
};

export default NotesTableContent;