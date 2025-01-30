"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Note, Subject } from "@/types/redux-toolkit";

interface propTypes { MainData: Subject[] | Note[]; handleFilteredData: (newPaginateDate: unknown) => void; currentPage: number; setCurrentPage: Dispatch<SetStateAction<number>>; }
export default function PagePagination({ MainData, handleFilteredData, currentPage, setCurrentPage }: propTypes) {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(MainData.length / itemsPerPage);

  React.useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const newPaginateDate = MainData.slice(startIndex, startIndex + itemsPerPage);
    handleFilteredData(newPaginateDate);
  }, [MainData, currentPage, handleFilteredData]);

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Page */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => goToPage(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-70 text-slate-50 font-bold drop-shadow-lg" : "text-slate-200 font-bold drop-shadow-lg hover:text-slate-400 transition duration-300 ease-in-out"}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              isActive={index + 1 === currentPage}
              className={`${index + 1 !== currentPage ?  "opacity-40 hover:opacity-80": ""} text-slate-200 font-bold drop-shadow-lg border-none rounded-md hover:text-slate-50 transition duration-300 ease-in-out`}
              onClick={() => goToPage(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Ellipsis (only if there are more than 5 pages) */}
        {totalPages > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

        {/* Next Page */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => goToPage(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-70 text-slate-50 font-bold drop-shadow-lg" : "text-slate-200 font-bold drop-shadow-lg hover:text-slate-400 transition duration-300 ease-in-out"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}