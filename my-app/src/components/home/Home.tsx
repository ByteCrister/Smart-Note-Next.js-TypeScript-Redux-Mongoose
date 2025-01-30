"use client";

import { useAppSelector } from "@/lib/hooks";
import SubjectTableContent from "./subject/TableContent";
import NotesTableContent from "./subject-note/NotesTableContent";
import { signOut } from "@/services/helper/REST-API/SignOut";
import { useRouter } from "next/navigation";


const Home = () => {

    const { selectedSubjectIndex } = useAppSelector((state) => state.noteStore);
    const router = useRouter();

    const handleLogOut = async () => {
        if (await signOut()) {
            router.push('/user-auth');
        }
    };

    const LogOutBtn = (): React.ReactElement => {
        return (
            <button type="button" onClick={handleLogOut} className="backdrop-blur-sm px-3 py-1 text-slate-300 font-semibold">
                Log Out
            </button>
        );
    };

    return (
        <div className="w-full h-screen flex flex-col gap-2 justify-center items-center p-2 bg-center" style={{ backgroundImage: "url('/images/notepad-4216830_640.jpg')", }}>
            <h1 className="text-2xl md:text-3xl text-gray-300 font-bold border-2 border-slate-500 border-opacity-10 px-3 py-2 rounded-2xl backdrop-blur-sm">Smart Note - Subject&apos;s {selectedSubjectIndex ? "Notes" : ""}</h1>
            {(selectedSubjectIndex !== null && selectedSubjectIndex !== undefined && selectedSubjectIndex >= 0) ? <NotesTableContent /> : <SubjectTableContent />}
            <LogOutBtn />
        </div>
    )
};

export default Home;