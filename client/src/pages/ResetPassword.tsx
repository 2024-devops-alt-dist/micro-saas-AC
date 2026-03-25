import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

function ResetPassword() {
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        setLoading(true);
        try {
            await apiFetch("/api/password-reset/confirm/", {
                method: "POST",
                body: JSON.stringify({ uid, token, new_password: newPassword }),
            });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
            <h2 className="text-2xl font-bold mb-6">Nouveau mot de passe</h2>

            {success ? (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-lg text-center">
                    Mot de passe réinitialisé ! Redirection vers la connexion...
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 bg-gray-800/60 px-8 py-6 rounded-lg">
                    {error && (
                        <p className="text-red-500 text-sm bg-red-100/10 p-2 rounded">{error}</p>
                    )}
                    <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 rounded bg-gray-700 placeholder-gray-400"
                        required
                        minLength={8}
                    />
                    <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full p-3 rounded bg-gray-700 placeholder-gray-400"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-lg bg-yellow-300 hover:bg-yellow-400 font-bold text-black transition disabled:opacity-50"
                    >
                        {loading ? "Enregistrement..." : "Réinitialiser"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default ResetPassword;
