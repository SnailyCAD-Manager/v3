import CustomCard from "@/components/ui/CustomCard";
import socket from "@/utils/socket";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { UserLoginData } from "@scm/types";
import { useEffect } from "react";

export default function LoginPage() {
    const loginForm = useForm({
        initialValues: {
            username: "",
            password: "",
        },
    });

    function handleSubmit(values: typeof loginForm.values) {
        socket.emit("server:user-login", values as UserLoginData);
        loginForm.reset();
    }

    useEffect(() => {
        const session = localStorage.getItem("snailycad-manager:session");

        session && socket.emit("server:user-session", session);

        socket.on("error", (error: string) => {
            if (error.includes("session not found")) {
                localStorage.removeItem("snailycad-manager:session");
            }
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <CustomCard
                className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4"
                shadow="md"
            >
                <form
                    onSubmit={loginForm.onSubmit((values) =>
                        handleSubmit(values)
                    )}
                    className="flex flex-col gap-2"
                >
                    <div className="flex flex-col items-center justify-center gap-2 mb-6">
                        <img
                            src="/logo.png"
                            className="w-16 aspect-square"
                            alt="logo"
                        />
                        <h1 className="text-3xl font-bold">Manager Login</h1>
                    </div>
                    <div className="flex flex-col gap-2">
                        <TextInput
                            type="text"
                            label="Username"
                            placeholder="Username"
                            {...loginForm.getInputProps("username")}
                            required
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Password"
                            {...loginForm.getInputProps("password")}
                            required
                        />

                        <Button type="submit" variant="light">
                            Login
                        </Button>
                    </div>
                </form>
            </CustomCard>
        </div>
    );
}
