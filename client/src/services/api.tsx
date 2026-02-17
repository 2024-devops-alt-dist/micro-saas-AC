
const API_URL = import.meta.env.VITE_API_URL;
//vérifier si il y a un jeton dans le navigateur si oui l'ajouter à la requête dans les headers
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  if (!API_URL) {
    throw new Error("API_URL is not defined");
  }

  const token = localStorage.getItem("access_token");

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      const error = new Error("Session expirée ou jeton invalide. Veuillez vous reconnecter.");
      (error as any).status = 401;
      throw error;
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      const error = new Error(errorData.message || errorData.detail || "Erreur lors de la récupération des données");
      (error as any).status = response.status;
      throw error;
    }
    return response.json();
  } catch (error) {
    // Si l'erreur a déjà un statut (elle vient de notre code ci-dessus), on la relance telle quelle
    if (error instanceof Error && (error as any).status) {
      throw error;
    }
    throw new Error("Erreur réseau ou serveur : " + (error instanceof Error ? error.message : String(error)));
  }

}


// GET
export function getCategories() {
  return apiFetch("/api/categories/");
}

export function getLevels() {
  return apiFetch("/api/levels/");
}

export function saveQuizStats(stats: { user_id: number, category_id: number, level_id: number, score: number }) {
  return apiFetch("/api/stats/", {
    method: "POST",
    body: JSON.stringify(stats),
  });
}