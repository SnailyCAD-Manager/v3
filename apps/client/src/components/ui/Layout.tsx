import { useAuth } from "@/hooks/useAuth";
import { useInstance } from "@/hooks/useInstance";
import { useManagerUpdate } from "@/hooks/useManagerUpdate";
import { AppPages, usePage } from "@/hooks/usePage";
import { useUpdate } from "@/hooks/useUpdate";
import UpdatingModal from "@/utils/modals/updating";
import SpotlightActions from "@/utils/spotlight/spotlight";
import UserLogout from "@/utils/user/logout";
import {
    Alert,
    Anchor,
    AppShell,
    Badge,
    Burger,
    Divider,
    Group,
    Kbd,
    Menu,
    NavLink,
    ScrollArea,
    TextInput,
    UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Spotlight, spotlight } from "@mantine/spotlight";
import {
    IconBrandDiscord,
    IconChevronRight,
    IconLock,
    IconLogout,
    IconPassword,
    IconSearch,
    IconSwitchHorizontal,
    IconTerminal,
    IconUser,
} from "@tabler/icons-react";

interface Props {
    children: React.ReactNode;
}

export function Layout(props: Props) {
    const [opened, { toggle }] = useDisclosure();
    const { page: activePage, setPage } = usePage();
    const instances = useInstance((state) => state.instances);
    const activeInstanceData = instances.find(
        (i) => i.id === useInstance.getState().activeInstance
    );
    const updateInProgress = useUpdate((state) => state.inProgress);
    const activeInstance = useInstance((state) => state.activeInstance);
    const user = useAuth((state) => state.user);
    const managerUpdateAvailable = useManagerUpdate(
        (state) => state.updateAvailable
    );

    return (
        <>
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 300,
                    breakpoint: "sm",
                    collapsed: { mobile: !opened },
                }}
                padding="md"
                className="h-full"
            >
                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <div className="h-full p-2.5 flex flex-row items-center gap-2">
                            <img
                                src="/logo.png"
                                className="h-full aspect-square"
                                alt="logo"
                            />
                            <h1 className="text-xl font-bold">
                                SnailyCAD Manager
                            </h1>
                        </div>
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar p="md">
                    <AppShell.Section className="font-bold flex flex-col gap-2">
                        <UnstyledButton
                            className="relative w-full rounded-md"
                            onClick={() => spotlight.open()}
                        >
                            <span className="absolute top-0 left-0 z-10 w-full h-full rounded-md hover:bg-white/5" />
                            <TextInput
                                placeholder="Quick Action"
                                leftSection={<IconSearch size={16} />}
                                rightSection={<Kbd>/</Kbd>}
                                className="w-full"
                            />
                        </UnstyledButton>
                        <Divider className="my-2" />
                        <NavLink
                            label={
                                <div className="flex flex-row items-center gap-1">
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            activeInstanceData?.status.api &&
                                            activeInstanceData?.status.client
                                                ? "!bg-green-500"
                                                : activeInstanceData?.status
                                                        .api ||
                                                    activeInstanceData?.status
                                                        .client
                                                  ? "!bg-yellow-500"
                                                  : "!bg-red-500"
                                        }`}
                                    />
                                    <span>Instance:</span>
                                    <span className="font-normal">
                                        {activeInstanceData?.name || "None"}
                                    </span>
                                </div>
                            }
                            rightSection={<IconSwitchHorizontal size="1rem" />}
                            className="!bg-white/5 hover:!bg-white/10"
                            onClick={() => setPage("instance-selector")}
                        />
                    </AppShell.Section>
                    <Divider className="mt-4" />
                    <AppShell.Section grow my="md" component={ScrollArea}>
                        {AppPages.map(
                            (page) =>
                                !page.noNav && (
                                    <NavLink
                                        active={page.id === activePage.id}
                                        className={`rounded-md ${page.roleRequired && !(user?.role === page.roleRequired) && "!hidden"}`}
                                        key={page.id}
                                        leftSection={page.icon}
                                        rightSection={
                                            page.roleRequired && (
                                                <Badge
                                                    color="orange"
                                                    radius={"sm"}
                                                    size="sm"
                                                    variant="light"
                                                >
                                                    {page.roleRequired}
                                                </Badge>
                                            )
                                        }
                                        label={page.name}
                                        onClick={() => {
                                            setPage(page.id);
                                            opened && toggle();
                                        }}
                                    />
                                )
                        )}
                    </AppShell.Section>
                    {!managerUpdateAvailable && user?.role === "admin" && (
                        <AppShell.Section className="mb-4">
                            <Alert
                                color="red"
                                title="Manager update available!"
                                children={
                                    <div className="flex flex-col gap-1">
                                        <span>
                                            A new version of SnailyCAD Manager
                                            is available. Click here to update.
                                        </span>
                                        <span className="text-muted text-xs flex flex-row gap-1 items-center">
                                            <IconLock size={10} />
                                            Only admins can see this message.
                                        </span>
                                    </div>
                                }
                                className="cursor-pointer"
                                onClick={() => {
                                    console.log("Update");
                                }}
                            />
                        </AppShell.Section>
                    )}
                    <Menu position="top-end">
                        <Menu.Target>
                            <UnstyledButton className="!bg-white/5 hover:bg-white/10 rounded-md !p-2 flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center gap-2">
                                    <IconUser size={20} />
                                    <span className="text-sm">
                                        {user?.username}
                                    </span>
                                </div>
                                <IconChevronRight size={20} />
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Settings</Menu.Label>
                            <Menu.Item
                                leftSection={<IconPassword size={18} />}
                                onClick={() => setPage("password-reset")}
                            >
                                Password Reset
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Label>Account</Menu.Label>
                            <Menu.Item
                                color="red"
                                leftSection={<IconLogout size={18} />}
                                onClick={UserLogout}
                            >
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    <Divider className="my-4" />
                    <AppShell.Section className="opacity-75 hover:opacity-100">
                        <div className="text-center flex flex-row items-center justify-center gap-2 text-xs">
                            <span>Need help?</span>
                            <Anchor
                                href="https://dsc.gg/snailycad"
                                target="_blank"
                            >
                                <div className="flex flex-row items-center justify-center gap-1 text-xs">
                                    <span>Join the SnalyCAD Discord</span>
                                    <IconBrandDiscord size={12} />
                                </div>
                            </Anchor>
                        </div>
                    </AppShell.Section>
                </AppShell.Navbar>
                <AppShell.Main className="bg-[#141414] h-full">
                    {props.children}
                </AppShell.Main>
            </AppShell>
            <Spotlight
                actions={SpotlightActions}
                radius={10}
                nothingFound="No actions found"
                highlightQuery
                limit={4}
                searchProps={{
                    placeholder: "Run an action...",
                    autoFocus: true,
                    leftSection: <IconTerminal />,
                }}
                shortcut={[
                    "ctrl + k",
                    "cmd + k",
                    "ctrl + space",
                    "cmd + space",
                    "ctrl + p",
                    "cmd + p",
                    "/",
                ]}
            />

            <UpdatingModal
                opened={
                    updateInProgress.id === activeInstance &&
                    updateInProgress.inProgress
                }
            />
        </>
    );
}
