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
import UpdateSubject from "./UpdateSubject";
import DeleteSubject from "./DeleteSubject";
import React, { useState } from "react";
import { Subject } from "@/types/redux-toolkit";
import PagePagination from "../../common/PagePagination";
import { setSelectedSubjectIndex } from "@/lib/features/notes/noteSlice";
import AddSubject from "./AddSubject";
import SubjectSearch from "./SubjectSearch";
import { LOADING } from "@/services/helper/common/constants";
import { SkeletonSearchNav, SkeletonTable } from "@/components/common/SkeletonComponent";

const SubjectTableContent = () => {
    const { subjects, status } = useAppSelector((state) => state.noteStore);
    const [Data, setData] = useState<Subject[] | null>([...subjects.slice(0, 4)]);
    const dispatch = useAppDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const handleFilteredData = (newPaginateDate: unknown) => {
        if (Array.isArray(newPaginateDate)) {
            setData([...newPaginateDate]);
        } else {
            console.error("newPaginateDate is not an array:", newPaginateDate);
        }
    };

    return (
        < >
            {
                status === LOADING ? <SkeletonSearchNav /> : <section className="w-full flex gap-2 justify-center items-center">
                    <SubjectSearch setData={setData} currentPage={currentPage}/> <AddSubject />
                </section>
            }
            {
                status === LOADING ? <SkeletonTable /> : <section className="w-[90%] md:w-[60%] relative bg-cover bg-center backdrop-blur-md rounded-xl">
                    <div className="absolute inset-0 bg-slate-400 opacity-15 rounded-xl"></div>
                    <div className="relative z-10 text-slate-100 p-8">
                        <Table>
                            <TableHeader className="backdrop-blur-sm rounded-xl border-b-0 mb-4">
                                <TableRow className="border-0 border-none">
                                    <TableHead className="text-center" >Subject</TableHead>
                                    <TableHead className="text-center">Notes</TableHead>
                                    <TableHead className="text-center">View</TableHead>
                                    <TableHead className="text-center" >Created</TableHead>
                                    <TableHead className="text-center" >Last Modified</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Data && Data?.map((subject, index) => (
                                    <TableRow className="border-stone-300 border-b" key={index}>
                                        <TableCell >{subject.name}</TableCell>
                                        <TableCell >{subject.notes.length}</TableCell>
                                        <TableCell
                                            className="cursor-pointer hover:underline hover:underline-offset-1"
                                            onClick={() => dispatch(setSelectedSubjectIndex(index))}>{"Notes"}</TableCell>
                                        <TableCell >{new Date(subject.createdAt).toLocaleString()}</TableCell>
                                        <TableCell >{new Date(subject.updatedAt).toLocaleString()}</TableCell>
                                        <TableCell className="flex items-center gap-1"><UpdateSubject SubjectName={subject.name} Index={index} /> <DeleteSubject Index={index} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            }
            <PagePagination MainData={subjects} handleFilteredData={handleFilteredData} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </>
    )
};

export default SubjectTableContent;