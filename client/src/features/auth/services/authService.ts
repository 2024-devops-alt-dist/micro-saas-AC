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
            // On récupère le profil complet pour avoir l'ID et l'email
            const profile = await this.getProfile();
            if (profile.id) {
                localStorage.setItem("user_id", profile.id.toString());
            }
            if (profile.email) {
                localStorage.setItem("email", profile.email);
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
        localStorage.removeItem("email");
    },

    isAuthenticated() {
        return !!localStorage.getItem("access_token");
    },

    getUsername() {
        return localStorage.getItem("username") || "?";
    },

    getEmail() {
        return localStorage.getItem("email") || "?";
    },

    async updateProfile(currentPassword: string, newEmail?: string, newPassword?: string) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify({
                current_password: currentPassword,
                email: newEmail,
                new_password: newPassword
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Erreur lors de la mise à jour du profil");
        }

        const data = await response.json();

        // Mettre à jour l'email dans le localStorage si modifié
        if (newEmail && data.user?.email) {
            localStorage.setItem("email", data.user.email);
        }

        // Si le mot de passe a été changé, déconnecter l'utilisateur pour qu'il se reconnecte
        if (newPassword) {
            this.logout();
        }

        return data;
    },
};
