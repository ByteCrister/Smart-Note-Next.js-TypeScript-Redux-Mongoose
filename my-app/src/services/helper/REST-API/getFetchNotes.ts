import { getFetchNotesTypes } from "@/types/functions";
import axios from "axios";
import { signOut } from "./SignOut";

const getFetchNotes = async (token: string): Promise<getFetchNotesTypes> => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/notes`, { token }, { withCredentials: true });
        return response.data;
    } catch (error: unknown) {
        console.log(error);
        await signOut();
        return { user_id: "", subjects: [] };
    }
};
export default getFetchNotes;