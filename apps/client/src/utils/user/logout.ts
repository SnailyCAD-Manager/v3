import { useAuth } from "@/hooks/useAuth";
import socket from "../socket";
import { notifications } from "@mantine/notifications";

export default function UserLogout() {
    const user = useAuth.getState().user;
    const setUser = useAuth.getState().setUser;
    const setIsAuth = useAuth.getState().setIsAuth;

    localStorage.removeItem("snailycad-manager:session");
    setUser(null);
    setIsAuth(false);

    notifications.show({
        title: "Logged out",
        message: "Successfully logged out",
        color: "green",
    });

    socket.emit("server:user-logout", user?.id);
}
