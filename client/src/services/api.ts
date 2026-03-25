const API_URL = import.meta.env.VITE_API_URL;

// Fonction centrale pour tous les appels à l'API backend.
// Les tokens JWT sont transmis automatiquement via les cookies HTTP-only (credentials: "include").
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  if (!API_URL) {
    throw new Error("API_URL is not defined");
  }

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // Envoie les cookies HTTP-only à chaque requête
    });

    if (response.status === 401) {
      // Session expirée : on nettoie uniquement les données de profil UI
      // dans le local storage se trouve uniquement des données de profil (pas de token)
      localStorage.removeItem("username");
      localStorage.removeItem("user_id");
      localStorage.removeItem("email");
      throw createApiError(
        "Session expirée ou jeton invalide. Veuillez vous reconnecter.",
        401
      );
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      // Erreurs de validation DRF : { "email": ["msg"], "username": ["msg"] }
      const firstFieldError = Object.values(errorData)
        .find((v) => Array.isArray(v) && v.length > 0);
      const fieldMessage = Array.isArray(firstFieldError) ? firstFieldError[0] : null;

      throw createApiError(
        fieldMessage || errorData.message || errorData.detail || errorData.error || "Erreur lors de la récupération des données",
        response.status
      );
    }

    return response.json();
  } catch (error) {
    // Si c'est déjà une ApiError, on la relance telle quelle
    if (isApiError(error)) {
      throw error;
    }
    throw new Error("Erreur réseau ou serveur", { cause: error });
  }
}

export type ApiError = Error & { status: number; isApiError: true };

function createApiError(message: string, status: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.isApiError = true;
  return error;
}

function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && (error as ApiError).isApiError === true;
}

// GET
export function getCategories() {
  return apiFetch("/api/categories/");
}

export function getLevels() {
  return apiFetch("/api/levels/");
}

export function saveQuizStats(stats: {
  user_id: number;
  category_id: number;
  level_id: number;
  score: number;
}) {
  return apiFetch("/api/stats/", {
    method: "POST",
    body: JSON.stringify(stats),
  });
}
