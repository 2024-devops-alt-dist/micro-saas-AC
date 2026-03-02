import AuthForm from "../features/auth/components/AuthForm";
import BottomNav from "../components/BottomNav";
import Title from "../components/Title";

export default function Register() {
    return (
        <main className="min-h-screen bg-gray-900 pb-20">
            <Title text="INSCRIPTION" />
            <AuthForm initialIsLogin={false} />
            <BottomNav />
        </main>
    );
}
