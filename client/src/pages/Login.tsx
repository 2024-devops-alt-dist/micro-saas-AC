import AuthForm from "../features/auth/components/AuthForm";
import BottomNav from "../components/BottomNav";
import Title from "../components/Title";

export default function Login() {
    return (
        <div className="min-h-screen bg-gray-900 pb-20">
            <Title text="CONNEXION" />
            <AuthForm initialIsLogin={true} />
            <BottomNav />
        </div>
    );
}
