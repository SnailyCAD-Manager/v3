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
import LoginPage from "@/pages/login";

export default function App() {
    const { page } = usePage();
    const { isAuth } = useAuth();
    const { connected } = useSocket();
    const activeInstance = useInstance((state) => state.activeInstance);
    const { activeInstanceData } = useInstance();

    return (
        <>
            <div className="absolute top-0 right-0 z-[10000] bg-neutral-500/20 select-none p-2">
                {JSON.stringify(activeInstanceData?.status)}
            </div>
            {!connected && <LoadingOverlay />}
            {!isAuth && <LoginPage />}
            {!activeInstance && <InstanceSelector />}
            {/* Add pages MUST BE WITH SWITCH */}
            {page.id === "instance-selector" && <InstanceSelector />}
            {page.id === "instance-create" && <InstanceCreatePage />}
            {page.id === "home" && (
                <Layout>
                    <HomePage />
                </Layout>
            )}
            {page.id === "login" && <LoginPage />}
            {page.id === "env-editor" && (
                <Layout>
                    <EnvEditorPage />
                </Layout>
            )}
            {/* Default to 404 without checking for each page */}
            {page.id !== "instance-selector" &&
                page.id !== "instance-create" &&
                page.id !== "home" &&
                page.id !== "login" &&
                page.id !== "env-editor" && <NotFound />}
        </>
    );

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
        default:
            return <NotFound />;
    }
}
