import { Layout } from "@/components/ui/Layout";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useAuth } from "@/hooks/useAuth";
import { usePage } from "@/hooks/usePage";
import { useSocket } from "@/hooks/useSocket";
import NotFound from "@/pages/404";
import EnvEditorPage from "@/pages/env-editor";
import HomePage from "@/pages/home";
import InstanceCreatePage from "@/pages/instance-create";
import InstanceSelector from "@/pages/instance-selector";
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
        case "instance-selector":
            return <InstanceSelector />;
        case "instance-create":
            return <InstanceCreatePage />;
        case "home":
            return (
                <Layout>
                    <HomePage />
                </Layout>
            );
        case "login":
            return <LoginPage />;
        case "env-editor":
            return (
                <Layout>
                    <EnvEditorPage />
                </Layout>
            );
        default:
            return <NotFound />;
    }
}
