import { useState, Dispatch, SetStateAction } from "react";
import { Note } from "@/types/redux-toolkit";
import useNoteSearch from "@/hooks/useNoteSearch";

type PropTypes = {
    setData: Dispatch<SetStateAction<Note[] | null>>;
    currentPage: number;
};

const NoteSearch = ({ setData, currentPage }: PropTypes) => {
    const [searchText, setSearchText] = useState("");
    const search = useNoteSearch();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        search(currentPage, value, setData);
    };

    return (
        <div className="w-[80%] md:w-[50%] backdrop-blur-sm shadow-xl rounded-xl">
            <input
                type="text"
                value={searchText}
                onChange={onChange}
                placeholder="Search here..."
                className="outline-none px-3 py-2 rounded-xl bg-transparent w-full text-slate-500 font-semibold drop-shadow"
            />
        </div>
    );
};

export default NoteSearch;