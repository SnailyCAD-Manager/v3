import { useAuth } from "@/hooks/useAuth";
import socket from "@/utils/socket";
import {
    ActionIcon,
    Button,
    Modal,
    PasswordInput,
    Select,
    Skeleton,
    Table,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { User } from "@scm/types";
import {
    IconEdit,
    IconPlus,
    IconRefresh,
    IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[] | null>(null);
    const currentUser = useAuth((state) => state.user);
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editMode, setEditMode] = useState<{
        user: User;
        allUsers: User[];
    } | null>(null);

    useEffect(() => {
        socket.emit("server:get-users");
        socket.on("client:get-users", (users: User[]) => {
            setUsers(users);
        });

        return () => {
            socket.off("client:get-users");
        };
    }, []);

    return (
        <div className="w-full h-full">
            <div className="flex justify-end gap-2">
                <Tooltip label="Add User">
                    <ActionIcon
                        variant="light"
                        onClick={() => setUserModalOpen(true)}
                    >
                        <IconPlus size={20} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="Refresh Users">
                    <ActionIcon
                        variant="light"
                        onClick={() => {
                            socket.emit("server:get-users");
                        }}
                    >
                        <IconRefresh size={20} />
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
                                                    disabled={
                                                        user.username ===
                                                            "admin" &&
                                                        currentUser?.username !==
                                                            "admin"
                                                    }
                                                    onClick={() => {
                                                        setEditMode({
                                                            user,
                                                            allUsers: users,
                                                        });
                                                        setUserModalOpen(true);
                                                    }}
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
                                                    onClick={() => {
                                                        socket.emit(
                                                            "server:delete-user",
                                                            user.id
                                                        );
                                                    }}
                                                    disabled={
                                                        user.username ===
                                                            "admin" ||
                                                        currentUser?.id ===
                                                            user.id
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
            <AddUserModal
                open={userModalOpen}
                onClose={() => {
                    setUserModalOpen(false);
                    setEditMode(null);
                }}
                editMode={editMode}
            />
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

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
    editMode?: {
        user: User;
        allUsers: User[];
    } | null;
}

function AddUserModal(props: AddUserModalProps) {
    const user = useAuth((state) => state.user);

    const addUserForm = useForm({
        initialValues: {
            username: "",
            password: "",
            role: "user",
        },
        validate: {
            username: (value) => {
                const usernameExists = props.editMode?.allUsers.find(
                    (user) => user.username === value
                );

                if (value.length < 3) {
                    return "Username must be at least 3 characters long";
                }

                if (!props.editMode && usernameExists) {
                    return "Username already exists";
                }

                return null;
            },
            password: (value) => {
                if (value.length < 8 && !props.editMode) {
                    return "Password must be at least 8 characters long";
                }
                return null;
            },
        },
    });

    useEffect(() => {
        if (props.editMode) {
            addUserForm.setValues({
                username: props.editMode.user.username,
                password: "",
                role: props.editMode.user.role,
            });
        } else {
            addUserForm.setValues({
                username: "",
                password: "",
                role: "user",
            });
        }
    }, [props.editMode]);

    function handleSubmitUser(values: typeof addUserForm.values) {
        if (props.editMode) {
            const data = {
                username:
                    values.username === ""
                        ? props.editMode.user.username
                        : values.username,
                newPassword: values.password === "" ? null : values.password,
                role: values.role,
                id: props.editMode.user.id,
            };

            socket.emit("server:update-user", data);
        } else {
            socket.emit("server:add-user", values);
            props.onClose();
        }

        props.onClose();
    }

    return (
        <Modal
            opened={props.open}
            onClose={props.onClose}
            centered
            title={<span className="text-lg font-bold">Add User</span>}
        >
            <form
                onSubmit={addUserForm.onSubmit((values) =>
                    handleSubmitUser(values)
                )}
                className="flex flex-col gap-2"
            >
                <TextInput
                    label="Username"
                    required
                    disabled={
                        props.editMode?.user.username === "admin" ||
                        user?.id === props.editMode?.user.id
                    }
                    {...addUserForm.getInputProps("username")}
                />
                <PasswordInput
                    label={props.editMode ? "Temp Password" : "Password"}
                    required={!props.editMode}
                    description={
                        props.editMode
                            ? "Leave blank to keep the same password. Changing this password will prompt the user to change their password on next login."
                            : ""
                    }
                    defaultVisible
                    {...addUserForm.getInputProps("password")}
                />
                <Select
                    label="Role"
                    disabled={
                        props.editMode?.user.username === "admin" ||
                        user?.id === props.editMode?.user.id
                    }
                    required
                    data={[
                        { label: "User", value: "user" },
                        { label: "Admin", value: "admin" },
                    ]}
                    {...addUserForm.getInputProps("role")}
                />

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        onClick={props.onClose}
                        variant="light"
                        color="red"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="light" color="blue">
                        {props.editMode ? "Save" : "Add"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
