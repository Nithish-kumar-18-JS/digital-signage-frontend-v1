import apiClient from "@/api/axois/axiosInterceptor";
import { Screen } from "@/types";


const addScreen = async (data:Screen) => {
    try {
        const response = await apiClient.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/screen`,
            data
        );
        return response.data;
    } catch (error:any) {
        console.error("Error adding screen:", error?.response || error);
        throw error;
    }
}

const getAllScreen = async () => {
    try {
        const response = await apiClient.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/screen`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error getting screen:", error?.response || error);
        throw error;
    }
}

const searchScreen = async (query: string) => {
    try {
        const response = await apiClient.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/screen/search?query=${query}`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error searching screen:", error?.response || error);
        throw error;
    }
}

const deleteScreen = async (id: number) => {
    try {
        const response = await apiClient.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/screen/${id}`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error deleting screen:", error?.response || error);
        throw error;
    }
}

const updateScreen = async (id: number, data: Screen) => {
    try {
        const response = await apiClient.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/screen/${id}`,
            data
        );
        return response.data;
    } catch (error:any) {
        console.error("Error updating screen:", error?.response || error);
        throw error;
    }
}   

export { addScreen, getAllScreen, searchScreen, deleteScreen, updateScreen };
