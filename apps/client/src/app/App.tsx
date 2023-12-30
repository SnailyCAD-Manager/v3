import { Layout } from "@/components/ui/Layout";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useAuth } from "@/hooks/useAuth";
import { usePage } from "@/hooks/usePage";
import { useSocket } from "@/hooks/useSocket";
import NotFound from "@/pages/404";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";

export default function App() {
    const { page } = usePage();
    const { isAuth } = useAuth();
    const { connected } = useSocket();

    // If not connected, show loading screen but never show anything else below
    if (!connected) {
        return <LoadingOverlay />;
    }

    if (!isAuth) {
        return <LoginPage />;
    }

    switch (page.id) {
        case "home":
            return (
                <Layout>
                    <HomePage />
                </Layout>
            );
        case "login":
            return <LoginPage />;
        default:
            return <NotFound />;
    }
}
