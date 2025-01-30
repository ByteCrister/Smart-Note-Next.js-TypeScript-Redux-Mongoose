import axios from "axios";

const getUserIdFromToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/user-id`, {}, { withCredentials: true });
        return response.data.user_id;
    } catch (error: unknown) {
        console.log(error);
        return null;
    }
};

export default getUserIdFromToken;