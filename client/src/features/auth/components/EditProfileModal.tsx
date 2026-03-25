import { useState } from "react";
import Button from "../../../components/Button";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string, newEmail?: string, newPassword?: string) => Promise<void>;
    onDeleteAccount: (currentPassword: string) => Promise<void>;
    currentEmail: string;
}

function EditProfileModal({ isOpen, onClose, onSubmit, onDeleteAccount, currentEmail }: EditProfileModalProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newEmail, setNewEmail] = useState(currentEmail);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!currentPassword) {
            setError("Le mot de passe actuel est requis");
            return;
        }

        if (newPassword && newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        if (newPassword && newPassword.length < 8) {
            setError("Le nouveau mot de passe doit contenir au moins 8 caractères");
            return;
        }

        // Si rien n'a changé
        if (newEmail === currentEmail && !newPassword) {
            setError("Aucune modification détectée");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(
                currentPassword,
                newEmail !== currentEmail ? newEmail : undefined,
                newPassword || undefined
            );
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };
    const deleteAccount = async () => {
        if (!currentPassword) {
            setError("Veuillez entrer votre mot de passe actuel pour supprimer votre compte");
            return;
        }
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
            return;
        }
        setLoading(true);
        try {
            await onDeleteAccount(currentPassword);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };


    const handleClose = () => {
        setCurrentPassword("");
        setNewEmail(currentEmail);
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full shadow-2xl">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Modifier mon profil</h2>
                    <p className="text-gray-400 text-sm mt-1">Mettez à jour vos informations</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Mot de passe actuel (requis) */}
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-2">
                            Mot de passe actuel *
                        </label>
                        <div className="relative">
                            <input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 pr-10 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                placeholder="Votre mot de passe actuel"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label={showCurrentPassword ? "Masquer le mot de passe actuel" : "Afficher le mot de passe actuel"}
                            >
                                {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="new-email" className="block text-sm font-medium text-gray-300 mb-2">
                            Nouvel email
                        </label>
                        <input
                            id="new-email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            placeholder="nouveau@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-2">
                            Nouveau mot de passe (optionnel)
                        </label>
                        <div className="relative">
                            <input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 pr-10 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                placeholder="Minimum 8 caractères"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label={showNewPassword ? "Masquer le nouveau mot de passe" : "Afficher le nouveau mot de passe"}
                            >
                                {showNewPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    {/* Confirmation nouveau mot de passe */}
                    {newPassword && (
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirmer le nouveau mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="Confirmez votre mot de passe"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                    aria-label={showConfirmPassword ? "Masquer la confirmation du mot de passe" : "Afficher la confirmation du mot de passe"}
                                >
                                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="pt-4">
                        <Button
                            type="button"
                            onClick={deleteAccount}
                            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                        >
                            Supprimer mon compte
                        </Button>
                    </div>


                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
