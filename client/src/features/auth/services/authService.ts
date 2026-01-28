import { apiFetch } from "../../../services/api";
//stocker le token dans localStorage
export const authService = {
    async login(username: string, password: string) {
        const data = await apiFetch("/api/token/", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
        if (data.access) {
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
        }
        return data;
    },

    async register(username: string, email: string, password: string) {
        return apiFetch("/api/register/", {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
        });
    },

    logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    },

    isAuthenticated() {
        return !!localStorage.getItem("access_token");
    },
};
