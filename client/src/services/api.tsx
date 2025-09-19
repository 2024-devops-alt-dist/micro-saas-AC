
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined");
}

export async function apiFetch(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) throw new Error("Erreur lors de la récupération des données");
    return response.json();
  } catch (error) {
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