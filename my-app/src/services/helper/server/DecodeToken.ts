import { jwtVerify } from 'jose';

const decodeToken = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET as string));
        return payload;
    } catch (error) {
        console.error("JWT verification error:", error);
        return null;
    }
};

export default decodeToken;