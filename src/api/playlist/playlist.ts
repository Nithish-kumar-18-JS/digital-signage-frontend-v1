import apiClient from "@/api/axois/axiosInterceptor";
import { Playlist } from "@/types/index";

const uploadPlaylist = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`,
            formData
        );

        return response.data;
    } catch (error:any) {
        console.error("Error uploading playlist:", error?.response || error);
        throw error;
    }
};

const addPlaylist = async (data:Playlist) => {
    try {
        const response = await apiClient.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlist`,
            data
        );
        return response.data;
    } catch (error:any) {
        console.error("Error adding playlist:", error?.response || error);
        throw error;
    }
}

const getAllPlaylist = async () => {
    try {
        const response = await apiClient.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlist`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error getting playlist:", error?.response || error);
        throw error;
    }
}

const searchPlaylist = async (query: string) => {
    try {
        const response = await apiClient.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlist/search?query=${query}`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error searching playlist:", error?.response || error);
        throw error;
    }
}

const deletePlaylist = async (id: number) => {
    try {
        const response = await apiClient.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlist/${id}`
        );
        return response.data;
    } catch (error:any) {
        console.error("Error deleting playlist:", error?.response || error);
        throw error;
    }
}

const updatePlaylist = async (id: number, data: Playlist) => {
    try {
        const response = await apiClient.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlist/${id}`,
            data
        );
        return response.data;
    } catch (error:any) {
        console.error("Error updating playlist:", error?.response || error);
        throw error;
    }
}   

export { uploadPlaylist, addPlaylist, getAllPlaylist, searchPlaylist, deletePlaylist, updatePlaylist };
