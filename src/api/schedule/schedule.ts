import apiClient from "@/api/axois/axiosInterceptor";
import { Schedule } from "@/types";


const addSchedule = async (data:Schedule) => {
    try {
        const response = await apiClient.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedule`,
            data
        );
        return response.data;
    } catch (error:any) {
        console.error("Error adding schedule:", error?.response || error);
        throw error;
    }
}

const getAllSchedule = async () => {
    try {
        const response = await apiClient.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedule`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error getting schedule:", error?.response || error);
        throw error;
    }
}

const searchSchedule = async (query: string) => {
    try {
        const response = await apiClient.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedule/search?query=${query}`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error searching schedule:", error?.response || error);
        throw error;
    }
}

const deleteSchedule = async (id: number) => {
    try {
        const response = await apiClient.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedule/${id}`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error deleting schedule:", error?.response || error);
        throw error;
    }
}

const updateSchedule = async (id: number, data: Schedule) => {
    try {
        const response = await apiClient.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedule/${id}`,
            data
        );
        return response.data;
    } catch (error:any) {
        console.error("Error updating schedule:", error?.response || error);
        throw error;
    }
}   

export { addSchedule, getAllSchedule, searchSchedule, deleteSchedule, updateSchedule };
