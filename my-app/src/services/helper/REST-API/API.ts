import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// GET request method
const GET_API = async (URL: string, config?: AxiosRequestConfig) => {
    try {
        const response: AxiosResponse = await axios.get(URL, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// POST request method
const POST_API = async (URL: string, data: unknown, config?: AxiosRequestConfig) => {
    try {
        const response: AxiosResponse = await axios.post(URL, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// PUT request method
const PUT_API = async (URL: string, data: unknown, config?: AxiosRequestConfig) => {
    try {
        const response: AxiosResponse = await axios.put(URL, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// DELETE request method
const DELETE_API = async (URL: string, config?: AxiosRequestConfig) => {
    try {
        const response: AxiosResponse = await axios.delete(URL, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { GET_API, POST_API, PUT_API, DELETE_API };


// const config = {
//     headers: { "Authorization": "Bearer your-token" }, // Example headers
// };