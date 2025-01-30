import { Note } from "@/types/redux-toolkit";
import { Dispatch, SetStateAction } from "react";
import debounce from "lodash/debounce";
import { useAppSelector } from "@/lib/hooks";
import { DebouncedFunc } from "lodash";

const useNoteSearch = (): DebouncedFunc<(searchedValue: string, setData: Dispatch<SetStateAction<Note[] | null>>) => void> => {

    const { subjects, selectedSubjectIndex } = useAppSelector(state => state.noteStore);

    return debounce((searchedValue: string, setData: Dispatch<SetStateAction<Note[] | null>>) => {

        // * step 1: add point field on each object
        let newMainData = [...subjects[selectedSubjectIndex ? selectedSubjectIndex : 0].notes.map((item) => ({ ...item, point: 0 }))];

        newMainData.forEach((outerItem, outerIndex) => {

            //initial point for one object
            let totalPoint = 0;

            // * step 2: give point based on most matched items
            Object.entries(outerItem).map(([key, value]) => {
                if (key !== 'point') {
                    if (key === "createdAt" || key === "updatedAt") {
                        const dateValue = typeof value === "string" || typeof value === "number" ? new Date(value).toLocaleString() : "";
                        totalPoint += dateValue.toLocaleLowerCase().includes(searchedValue.toLocaleLowerCase()) ||
                            searchedValue.toLocaleLowerCase().includes(dateValue.toLocaleLowerCase()) ? 5 : 0;
                        totalPoint += dateValue.toLocaleLowerCase() === searchedValue.toLocaleLowerCase() ? 10 : 0;
                    } else {
                        totalPoint += (String(value).toLocaleLowerCase().includes(searchedValue.toLocaleLowerCase()) || String(searchedValue.toLocaleLowerCase()).includes(String(value).toLocaleLowerCase())) ? 5 : 0;
                        totalPoint += String(value).toLocaleLowerCase() === searchedValue.toLocaleLowerCase() ? 10 : 0;
                    }
                }
            });

            // * step 3: updating the point 
            newMainData = newMainData.map((item, index) => outerIndex === index ? { ...item, point: totalPoint } : item)
        });

        // * step 4: filtering the array based on matched values
        newMainData = newMainData.filter((item) => {
            return (String(item.note).toLocaleLowerCase().includes(searchedValue.toLocaleLowerCase()) || searchedValue.toLocaleLowerCase().includes(String(item.note).toLocaleLowerCase())) ||
                (String(item.createdAt).toLocaleLowerCase().includes(searchedValue.toLocaleLowerCase()) || searchedValue.toLocaleLowerCase().includes(String(item.createdAt).toLocaleLowerCase())) ||
                (String(item.updatedAt).toLocaleLowerCase().includes(searchedValue.toLocaleLowerCase()) || searchedValue.toLocaleLowerCase().includes(String(item.createdAt).toLocaleLowerCase()))
        });

        // * step 5: sorting in descending order based on points
        newMainData.sort((a, b) => b.point - a.point);


        // * step 6: updating the value in the state management function
        setData([...newMainData].slice(0, 5));
    }, 500)
};

export default useNoteSearch;