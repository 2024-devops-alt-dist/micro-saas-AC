import { apiFetch } from "../../../services/api";

export interface UserStats {
    id: number;
    user_id: number;
    category_id: number;
    level_id: number;
    date: string;
    score: number;
}

/**
 * Récupère les statistiques de l'utilisateur connecté.
 * Le filtrage est fait côté serveur (Backend) pour plus de sécurité.
 */
export async function getUsersStats(): Promise<UserStats[]> {
    return apiFetch("/api/stats/");
}