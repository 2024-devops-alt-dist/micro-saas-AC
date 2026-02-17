import { apiFetch } from "../../../services/api";

export interface UserStats {
    id: number;
    user_id: number;
    category_id: number;
    category_name?: string;
    level_id: number;
    level_name?: string;
    date: string;
    score: number;
}

/**
 * Données fictives pour l'aperçu (mode déconnecté)
 */
export const MOCK_USER_STATS: UserStats[] = [
    { id: 1, user_id: 0, category_id: 1, category_name: "Français", level_id: 1, level_name: "Débutant", date: new Date().toISOString(), score: 8 },
    { id: 2, user_id: 0, category_id: 2, category_name: "Maths", level_id: 1, level_name: "Débutant", date: new Date().toISOString(), score: 5 },
    { id: 3, user_id: 0, category_id: 3, category_name: "Anglais", level_id: 2, level_name: "Intermédiaire", date: new Date().toISOString(), score: 9 },
    { id: 4, user_id: 0, category_id: 1, category_name: "Français", level_id: 1, level_name: "Débutant", date: new Date().toISOString(), score: 6 },
    { id: 5, user_id: 0, category_id: 4, category_name: "Géo", level_id: 1, level_name: "Débutant", date: new Date().toISOString(), score: 7 },
];

/**
 * Récupère les statistiques de l'utilisateur connecté.
 * Le filtrage est fait côté serveur (Backend) pour plus de sécurité.
 */
export async function getUsersStats(): Promise<UserStats[]> {
    return apiFetch("/api/stats/");
}

