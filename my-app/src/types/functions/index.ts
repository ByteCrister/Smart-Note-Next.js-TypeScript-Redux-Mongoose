import { Subject } from "../redux-toolkit";

export interface getFetchNotesTypes {
    user_id: string,
    subjects: Subject[]
};