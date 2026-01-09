import axios from "axios";
const backendPort = import.meta.env.VITE_BACKEND_PORT || 3006
const apiBaseURL = import.meta.env.MODE === "development" ? `http://localhost:${backendPort}/` : "alikohub.com/api/"
export const authApi = axios.create({
    baseURL: `${apiBaseURL}auth/`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})

export const contechApi = axios.create({
    baseURL: `${apiBaseURL}/`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})