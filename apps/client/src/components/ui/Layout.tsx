import { useInstance } from "@/hooks/useInstance";
import { AppPages, usePage } from "@/hooks/usePage";
import SpotlightActions from "@/utils/spotlight/spotlight";
import {
    Anchor,
    AppShell,
    Burger,
    Divider,
    Group,
    Kbd,
    NavLink,
    ScrollArea,
    TextInput,
    UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { IconSwitchHorizontal, IconTerminal } from "@tabler/icons-react";
import { IconBrandDiscord, IconSearch } from "@tabler/icons-react";

interface Props {
    children: React.ReactNode;
}

export function Layout(props: Props) {
    const [opened, { toggle }] = useDisclosure();
    const { page: activePage, setPage } = usePage();
    const { activeInstanceData } = useInstance();

    function GetActiveInstanceStatus(): "offline" | "partial" | "online" {
        if (
            activeInstanceData?.status.api &&
            activeInstanceData?.status.client
        ) {
            return "online";
        }

        if (
            !activeInstanceData?.status.api &&
            !activeInstanceData?.status.client
        ) {
            return "offline";
        }

        return "partial";
    }

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
                                            GetActiveInstanceStatus() ===
                                            "online"
                                                ? "!bg-green-500"
                                                : GetActiveInstanceStatus() ===
                                                    "partial"
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
                                        className="rounded-md"
                                        key={page.id}
                                        leftSection={page.icon}
                                        label={page.name}
                                        onClick={() => setPage(page.id)}
                                    />
                                )
                        )}
                    </AppShell.Section>
                    <Divider className="my-4" />
                    <AppShell.Section className="opacity-75 hover:opacity-100">
                        <div className="text-center flex flex-row items-center justify-center gap-2 text-xs">
                            <span>Need help?</span>
                            <Anchor
                                href="https://discord.gg/snailycad-community-792479048457912360"
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
                nothingFound="No actions found"
                highlightQuery
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
        </>
    );
}
