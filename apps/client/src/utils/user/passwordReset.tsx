import { Button, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";

export default function HandlePasswordReset() {
    const resetForm = useForm({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: {
            password: (value) => {
                if (value.length < 8) {
                    return "Password must be at least 8 characters long";
                }

                if (value !== resetForm.values.confirmPassword) {
                    return "Passwords do not match";
                }

                return null;
            },

            confirmPassword: (value) => {
                if (value.length < 8) {
                    return "Password must be at least 8 characters long";
                }

                if (value !== resetForm.values.password) {
                    return "Passwords do not match";
                }

                return null;
            },
        },
    });

    function handleResetPasswordSubmit(values: typeof resetForm.values) {
        console.log(values);
    }

    modals.open({
        title: <span className="text-lg font-bold">Reset Password</span>,
        children: (
            // Tell the user that a password reset is required, and give them a form to fill out
            <div>
                <p>
                    You are required to reset your password before you can
                    continue.
                </p>
                <form
                    onSubmit={resetForm.onSubmit((values) =>
                        handleResetPasswordSubmit(values)
                    )}
                    className="flex flex-col gap-2"
                >
                    <PasswordInput
                        label="Password"
                        required
                        {...resetForm.getInputProps("password")}
                    />
                    <PasswordInput
                        label="Confirm Password"
                        required
                        {...resetForm.getInputProps("confirmPassword")}
                    />
                    {/* Bottom Right Button */}
                    <div className="flex justify-end">
                        <Button type="submit" variant="light" color="teal">
                            Reset Password
                        </Button>
                    </div>
                </form>
            </div>
        ),
    });
}
