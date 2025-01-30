import axios from "axios";

export const signOut = async (): Promise<boolean> => {
    try {
        await axios.post(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/signout`,
            {},
            {
                withCredentials: true,
            }
        );
        return true;
    } catch (error) {
        console.error("Failed to sign out:", error);
        return false;
    }
};
