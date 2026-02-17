import React from "react";

type EmptyChartsProps = {
    variant: "unauthenticated" | "no-data" | "error";
    message?: string;
    isOverlay?: boolean;
};

const EmptyCharts: React.FC<EmptyChartsProps> = ({ variant, message, isOverlay }) => {
    const content = {
        unauthenticated: {
            title: "Suivez votre progression",
            description:
                "Connectez-vous pour accéder à vos statistiques et visualiser vos résultats.",
            cta: "Se connecter",
            href: "/login",
        },
        "no-data": {
            title: "Pas encore de données",
            description:
                "Faites quelques quiz pour commencer à voir votre progression ici.",
        },
        error: {
            title: "Impossible d'afficher le graphique",
            description:
                message || "Une erreur est survenue lors du chargement des données.",
        },
    }[variant];

    return (
        <div className={`flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6 transition-all duration-500 ${isOverlay
                ? "bg-white/40 backdrop-blur-[2px] rounded-3xl"
                : "bg-white rounded-3xl border border-slate-100"
            }`}>
            {/* Icône douce */}
            <div className="bg-indigo-50 text-indigo-600 rounded-full p-4 mb-5 shadow-sm">
                <svg
                    width="26"
                    height="26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M4 19h16M6 17V9a6 6 0 1112 0v8" />
                </svg>
            </div>

            <h3 className="text-slate-800 font-bold text-xl tracking-tight">
                {content.title}
            </h3>

            <p className="text-slate-600 text-sm mt-2 max-w-sm font-medium">
                {content.description}
            </p>

            {"cta" in content && content.cta && (
                <a
                    href={content.href}
                    className="mt-6 px-8 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
                >
                    {content.cta}
                </a>
            )}
        </div>
    );
};

export default EmptyCharts;
