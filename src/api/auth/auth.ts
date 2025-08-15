import { setCookie } from "@/lib/utils";
import apiClient from "../axois/axiosInterceptor";
import { Signup } from "@/types/index";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginData {
    email: string;
    password: string;
}

const login = async (data: LoginData) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/auth/login`, data);
        if(response.data.token){
            localStorage.setItem("x-auth-token", response.data.token);
            setCookie("x-auth-token", response.data.token);
        }else{
            throw new Error("Token not found in response");
        }
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const signup = async (data:Signup) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/auth/signup`, data);
        if(response.data.token){
            localStorage.setItem("x-auth-token", response.data.token);
            setCookie("x-auth-token", response.data.token);
        }else{
            throw new Error("Token not found in response");
        }
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export {
    login,
    signup
}