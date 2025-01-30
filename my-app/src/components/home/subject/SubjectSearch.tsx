import { useState, Dispatch, SetStateAction } from "react";
import { Subject } from "@/types/redux-toolkit";
import CallSubjectSearch from "@/hooks/useSubjectSearch";

type PropTypes = {
    setData: Dispatch<SetStateAction<Subject[] | null>>;
};

const SubjectSearch = ({ setData }: PropTypes) => {
    const [searchText, setSearchText] = useState("");
    const search = CallSubjectSearch();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        search(value, setData);
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

export default SubjectSearch;