import apiClient from "@/api/axois/axiosInterceptor";
import { Media } from "@/types";

const uploadMedia = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`,
            formData
        );

        return response.data;
    } catch (error:any) {
        console.error("Error uploading media:", error?.response || error);
        throw error;
    }
};

const addMedia = async (data:Media) => {
    try {
        const response = await apiClient.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/media`,
            data
        );
        return response.data;
    } catch (error:any) {
        console.error("Error adding media:", error?.response || error);
        throw error;
    }
}

const getAllMedia = async () => {
    try {
        const response = await apiClient.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/media`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error getting media:", error?.response || error);
        throw error;
    }
}

const searchMedia = async (query: string) => {
    try {
        const response = await apiClient.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/search?query=${query}`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error searching media:", error?.response || error);
        throw error;
    }
}

const deleteMedia = async (id: number) => {
    try {
        const response = await apiClient.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/${id}`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error deleting media:", error?.response || error);
        throw error;
    }
}

const updateMedia = async (id: number, data: Media) => {
    try {
        const response = await apiClient.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/${id}`,
            data
        );
        return response.data;
    } catch (error:any) {
        console.error("Error updating media:", error?.response || error);
        throw error;
    }
}   

export { uploadMedia, addMedia, getAllMedia, searchMedia, deleteMedia, updateMedia };
