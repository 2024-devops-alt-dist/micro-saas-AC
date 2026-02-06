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
            localStorage.setItem("username", username);
            // On récupère le profil complet pour avoir l'ID
            const profile = await this.getProfile();
            if (profile.id) {
                localStorage.setItem("user_id", profile.id.toString());
            }
        }
        return data;
    },

    async getProfile() {
        return apiFetch("/api/me/");
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
        localStorage.removeItem("username");
        localStorage.removeItem("user_id");
    },

    isAuthenticated() {
        return !!localStorage.getItem("access_token");
    },

    getUsername() {
        return localStorage.getItem("username") || "Utilisateur";
    },
};
