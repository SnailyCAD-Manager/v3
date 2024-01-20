import { Layout } from "@/components/ui/Layout";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useAuth } from "@/hooks/useAuth";
import { useInstance } from "@/hooks/useInstance";
import { usePage } from "@/hooks/usePage";
import { useSocket } from "@/hooks/useSocket";
import NotFound from "@/pages/404";
import EnvEditorPage from "@/pages/env-editor";
import HomePage from "@/pages/home";
import InstanceCreatePage from "@/pages/instance-create";
import InstanceSelector from "@/pages/instance-selector";
import KeyboardShortcutsPage from "@/pages/keyboard-shortcuts";
import LoginPage from "@/pages/login";
import ToolsPage from "@/pages/tools";
import InstanceSettingsPage from "@/pages/instance-settings";

export default function App() {
    const { page } = usePage();
    const { isAuth } = useAuth();
    const { connected } = useSocket();
    const activeInstance = useInstance((state) => state.activeInstance);

    if (!connected) {
        return <LoadingOverlay />;
    }

    if (!isAuth) {
        return <LoginPage />;
    }

    if (!activeInstance) {
        return <InstanceSelector />;
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
        case "tools":
            return (
                <Layout>
                    <ToolsPage />
                </Layout>
            );
        case "keyboard-shortcuts":
            return (
                <Layout>
                    <KeyboardShortcutsPage />
                </Layout>
            );
        case "instance-settings":
            return (
                <Layout>
                    <InstanceSettingsPage />
                </Layout>
            );
        default:
            return <NotFound />;
    }
}
