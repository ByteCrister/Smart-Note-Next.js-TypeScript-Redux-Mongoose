import axios from "axios";

const validateToken = async (): Promise<string> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/valid-token`, { withCredentials: true });
        return response.data.token;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data?.message || "Token validation failed");
        } else {
            console.log("Unexpected error:", error);
        }
        return "";
    }

};

export default validateToken;