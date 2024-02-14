import { useAuth } from "@/hooks/useAuth";
import socket from "@/utils/socket";
import {
    ActionIcon,
    Button,
    PasswordInput,
    Select,
    Skeleton,
    Table,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { User } from "@scm/types";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[] | null>(null);
    const currentUser = useAuth((state) => state.user);

    const addUserForm = useForm({
        initialValues: {
            username: "",
            password: "",
            role: "user",
        },
        validate: {
            username: (value) => {
                if (value.length < 3) {
                    return "Username must be at least 3 characters long";
                }
                return null;
            },
            password: (value) => {
                if (value.length < 8) {
                    return "Password must be at least 8 characters long";
                }
                return null;
            },
        },
    });

    function handleAddUserSubmit(values: typeof addUserForm.values) {
        console.log(values);
    }

    useEffect(() => {
        socket.emit("server:get-users");
        socket.on("client:get-users", (users: User[]) => {
            setUsers(users.filter((user) => user.id !== currentUser?.id));
        });

        return () => {
            socket.off("client:get-users");
        };
    }, []);

    function addUser() {
        modals.open({
            title: <span className="text-lg font-bold">Add User</span>,
            centered: true,
            children: (
                <form
                    onSubmit={addUserForm.onSubmit((values) =>
                        handleAddUserSubmit(values)
                    )}
                    className="flex flex-col gap-4"
                >
                    <TextInput
                        label="Username"
                        required
                        {...addUserForm.getInputProps("username")}
                    />
                    <PasswordInput
                        label="Password"
                        required
                        {...addUserForm.getInputProps("password")}
                    />
                    <Select
                        label="Role"
                        required
                        data={[
                            { value: "user", label: "User" },
                            { value: "admin", label: "Admin" },
                        ]}
                        {...addUserForm.getInputProps("role")}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" variant="light">
                            Add User
                        </Button>
                    </div>
                </form>
            ),
        });
    }

    return (
        <div className="w-full h-full">
            <div className="flex justify-end">
                <Tooltip label="Add User">
                    <ActionIcon variant="light" onClick={addUser}>
                        <IconPlus size={20} />
                    </ActionIcon>
                </Tooltip>
            </div>
            <Table.ScrollContainer minWidth={500} className="max-h-full">
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Username</Table.Th>
                            <Table.Th>Created</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {users ? (
                            users.length > 0 ? (
                                users.map((user) => {
                                    return (
                                        <Table.Tr key={user.id}>
                                            <Table.Td>{user.username}</Table.Td>
                                            <Table.Td>
                                                {new Date(
                                                    user.createdAt!
                                                ).toLocaleString()}
                                            </Table.Td>
                                            <Table.Td>{user.role}</Table.Td>
                                            <Table.Td className="flex flex-row gap-2">
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="blue"
                                                    leftSection={
                                                        <IconEdit size={16} />
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="light"
                                                    color="red"
                                                    leftSection={
                                                        <IconTrash size={16} />
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </Table.Td>
                                        </Table.Tr>
                                    );
                                })
                            ) : (
                                <Table.Tr>
                                    <Table.Td
                                        colSpan={4}
                                        className="text-center"
                                    >
                                        No users found.
                                    </Table.Td>
                                </Table.Tr>
                            )
                        ) : (
                            <UsersLoading />
                        )}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </div>
    );
}

function UsersLoading() {
    return (
        <>
            {Array(12)
                .fill(0)
                .map((_, i) => {
                    return (
                        <Table.Tr key={i}>
                            <Table.Td>
                                <Skeleton
                                    className="w-full"
                                    height={20}
                                    radius="sm"
                                />
                            </Table.Td>
                            <Table.Td>
                                <Skeleton
                                    className="w-full"
                                    height={20}
                                    radius="sm"
                                />
                            </Table.Td>
                            <Table.Td>
                                <Skeleton
                                    className="w-full"
                                    height={20}
                                    radius="sm"
                                />
                            </Table.Td>
                            <Table.Td>
                                <Skeleton
                                    className="w-full"
                                    height={20}
                                    radius="sm"
                                />
                            </Table.Td>
                        </Table.Tr>
                    );
                })}
        </>
    );
}
