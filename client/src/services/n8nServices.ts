
const N8N_WEBHOOK_URL = import.meta.env.DEV
    ? "/n8n/webhook/fd6a3ea2-c905-44d2-8a5a-7015e3c09e93"
    : import.meta.env.VITE_N8N_WEBHOOK_URL;

export async function generateQuizFromFile(file: File) {
    if (!N8N_WEBHOOK_URL) {
        throw new Error("N8N_WEBHOOK_URL is not defined");
    }

    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error("Erreur lors de la génération du quiz");
        return response.json();
    } catch (error) {
        throw new Error("Erreur réseau ou serveur : " + (error instanceof Error ? error.message : String(error)));
    }
}

