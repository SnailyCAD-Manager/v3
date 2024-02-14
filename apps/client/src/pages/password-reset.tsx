import CustomCard from "@/components/ui/CustomCard";
import { useAuth } from "@/hooks/useAuth";
import { usePage } from "@/hooks/usePage";
import socket from "@/utils/socket";
import { Button, Code, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function PasswordResetPage() {
    const user = useAuth((state) => state.user)!;
    const setPage = usePage((state) => state.setPage);

    const resetForm = useForm({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: {
            password: (value) => {
                if (value !== resetForm.values.confirmPassword) {
                    return "Passwords do not match";
                }

                if (value.length < 8) {
                    return "Password must be at least 8 characters long";
                }

                return null;
            },
            confirmPassword: (value) => {
                if (value !== resetForm.values.password) {
                    return "Passwords do not match";
                }

                if (value.length < 8) {
                    return "Password must be at least 8 characters long";
                }

                return null;
            },
        },
    });

    function handleSubmit(values: typeof resetForm.values) {
        socket.emit("server:user-password-reset", {
            id: user.id,
            newPassword: values.password,
        });

        resetForm.reset();
        setPage("instance-selector");
    }

    return (
        <div className="h-full w-full flex items-center justify-center">
            <CustomCard className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4 flex items-center">
                <h1 className="text-xl font-bold mb-4">
                    Reset Password for{" "}
                    <Code style={{ fontSize: "inherit" }}>{user.username}</Code>
                </h1>
                <form
                    onSubmit={resetForm.onSubmit((values) =>
                        handleSubmit(values)
                    )}
                    className="flex flex-col gap-4 w-full"
                >
                    <PasswordInput
                        label="New Password"
                        placeholder="New Password"
                        required
                        {...resetForm.getInputProps("password")}
                    />
                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        required
                        {...resetForm.getInputProps("confirmPassword")}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="light"
                            disabled={!resetForm.isValid}
                        >
                            Reset Password
                        </Button>
                    </div>
                </form>
            </CustomCard>
        </div>
    );
}
