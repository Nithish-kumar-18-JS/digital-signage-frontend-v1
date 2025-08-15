import apiClient from "../axois/axiosInterceptor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getDashboardData = async () => {
    try {
        const response = await apiClient.get(`${API_BASE_URL}/dashboard`);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}