import { useEffect, useState, useCallback } from "react";
import { getUsersStats, type UserStats } from "./statsService";

export type UseUserStatsState =
    | "loading"
    | "ready"
    | "unauthenticated"
    | "error";

export const useUserStats = () => {
    const [stats, setStats] = useState<UserStats[]>([]);
    const [state, setState] = useState<UseUserStatsState>("loading");
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setState("loading");
            setError(null);
            const data = await getUsersStats();
            setStats(data);
            setState("ready");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            const isAuthError = errorMessage.includes("Session expirée") ||
                errorMessage.includes("jeton invalide") ||
                (err as any).status === 401;

            if (!isAuthError) {
                console.error("Erreur lors de la récupération des stats:", err);
            }

            setError(errorMessage);

            if (isAuthError) {
                setState("unauthenticated");
            } else {
                setState("error");
            }
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, state, error, fetchStats };
};
