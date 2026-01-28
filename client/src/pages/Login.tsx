import AuthForm from "../features/auth/components/AuthForm";
import BottomNav from "../components/BottomNav";

export default function Login() {
    return (
        <div className="min-h-screen bg-gray-900 pb-20">
            <AuthForm initialIsLogin={true} />
            <BottomNav />
        </div>
    );
}
