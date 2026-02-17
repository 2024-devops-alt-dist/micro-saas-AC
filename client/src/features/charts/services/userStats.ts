import { useEffect, useState, useCallback } from "react";
import { getUsersStats, type UserStats, MOCK_USER_STATS } from "./statsService";

export type UseUserStatsState =
    | "loading"
    | "ready"
    | "unauthenticated"
    | "error";

export const useUserStats = () => {
    const [stats, setStats] = useState<UserStats[]>([]);
    const [state, setState] = useState<UseUserStatsState>("loading");
    const [error, setError] = useState<string | null>(null);
    console.log("stats mockés", MOCK_USER_STATS);

    const fetchStats = useCallback(async () => {
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        console.log("token ?", token);

        if (!token) {
            setStats(MOCK_USER_STATS);
            setState("unauthenticated");
            return;
        }

        try {
            setState("loading");
            setError(null);
            const data = await getUsersStats();
            console.log("data du user", data);
            setStats(data);
            setState("ready");

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            const isAuthError = errorMessage.includes("Session expirée") ||
                errorMessage.includes("token") ||
                errorMessage.includes("jeton") ||
                (err as any).status === 401;


            if (!isAuthError) {
                console.error("Erreur lors de la récupération des stats:", err);

            }

            setError(errorMessage);

            if (isAuthError) {
                setStats(MOCK_USER_STATS);
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

