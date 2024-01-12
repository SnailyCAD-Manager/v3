import { Button, Card, PasswordInput, TextInput } from "@mantine/core";

export default function LoginPage() {
    function handleSubmit() {}

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <Card className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4" shadow="md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div className="flex flex-col items-center justify-center gap-2 mb-6">
                        <img src="/logo.png" className="w-16 aspect-square" />
                        <h1 className="text-3xl font-bold">Manager Login</h1>
                    </div>
                    <div className="flex flex-col gap-2">
                        <TextInput
                            type="email"
                            label="Email"
                            placeholder="Email"
                            required
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Password"
                            required
                        />

                        <Button type="submit" variant="light">
                            Login
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
