import CustomCard from "@/components/ui/CustomCard";
import { useInstance } from "@/hooks/useInstance";
import Downgrade from "@/utils/controls/downgrade";
import SaveEnv from "@/utils/controls/env";
import forceUpdate from "@/utils/controls/forceUpdate";
import ResetDependencies from "@/utils/controls/resetDependencies";
import {
    Anchor,
    Button,
    Checkbox,
    Fieldset,
    ScrollArea,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export default function ToolsPage() {
    const activeInstanceData = useInstance((state) => state.activeInstanceData);

    const domainForm = useForm({
        initialValues: {
            client: "",
            api: "",
            useSSL: true,
        },
    });

    function handleDomainSubmit(values: typeof domainForm.values) {
        SaveEnv({
            ...activeInstanceData?.env,
            CORS_ORIGIN_URL: values.useSSL
                ? `https://${values.client}`
                : `http://${values.client}`,
            NEXT_PUBLIC_CLIENT_URL: values.useSSL
                ? `https://${values.client}`
                : `http://${values.client}`,
        });
    }

    return (
        <>
            <ScrollArea className="w-full h-full">
                <div className="flex flex-col item-center gap-4 p-[1px]">
                    <CustomCard className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">ENV Tools</h1>
                        <div className="flex flex-col mt-2">
                            <h1 className="text-xl font-bold">Quick Domain</h1>
                            <p className="text-xs text-muted">
                                Want to use a domain for SnailyCAD? Enter the
                                information required below, and SnailyCAD
                                Manager will automatically update your ENV
                            </p>
                            <p className="text-xs font-bold text-red-500/50">
                                THIS WILL STILL REQUIRE A{" "}
                                <Anchor
                                    className="!text-inherit !text-xs !font-bold !underline"
                                    href="https://docs.snailycad.org/docs/installations/reverse-proxies/cf-tunnels"
                                    target="_blank"
                                >
                                    PROXY METHOD
                                </Anchor>
                            </p>
                            <form
                                onSubmit={domainForm.onSubmit((values) =>
                                    handleDomainSubmit(values)
                                )}
                            >
                                <Fieldset
                                    legend={
                                        <span className="px-2">
                                            Domain Information
                                        </span>
                                    }
                                    className="flex flex-col gap-2 mt-2 !bg-transparent"
                                >
                                    <TextInput
                                        label="Client"
                                        placeholder="cad.yourdomain.tld"
                                        {...domainForm.getInputProps("client")}
                                        required
                                    ></TextInput>
                                    <TextInput
                                        label="API"
                                        placeholder="cad-api.yourdomain.tld"
                                        {...domainForm.getInputProps("api")}
                                        required
                                    ></TextInput>
                                    <div className="flex items-center justify-end gap-2">
                                        <Checkbox
                                            label="Use SSL (HTTPS)?&nbsp;"
                                            {...domainForm.getInputProps(
                                                "useSSL",
                                                { type: "checkbox" }
                                            )}
                                        />
                                        <Button type="submit" variant="light">
                                            Submit
                                        </Button>
                                    </div>
                                </Fieldset>
                            </form>
                        </div>
                    </CustomCard>
                    <CustomCard className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">
                            General CAD Tools
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            <CustomCard className="flex flex-col">
                                <h3 className="text-lg font-semibold">
                                    Reset Dependencies
                                </h3>
                                <p className="text-xs text-muted mb-2 grow">
                                    Uninstall & reinstall SnailyCAD
                                    dependencies.
                                </p>
                                <Button
                                    variant="light"
                                    onClick={async () => ResetDependencies()}
                                >
                                    Reset Dependencies
                                </Button>
                            </CustomCard>
                            <CustomCard className="flex flex-col">
                                <h3 className="text-lg font-semibold">
                                    Downgrade SnailyCAD
                                </h3>
                                <p className="text-xs text-muted mb-2 grow">
                                    Downgrade SnailyCAD to a previous stable
                                    release.
                                </p>
                                <Button
                                    variant="light"
                                    color="yellow"
                                    onClick={async () => await Downgrade()}
                                    className="justify-self-end"
                                >
                                    Downgrade SnailyCAD
                                </Button>
                            </CustomCard>
                            <CustomCard className="flex flex-col">
                                <h3 className="text-lg font-semibold">
                                    Force Update SnailyCAD
                                </h3>
                                <p className="text-xs text-muted mb-2 grow">
                                    Force update SnailyCAD to the latest commit.
                                </p>
                                <Button
                                    variant="light"
                                    color="orange"
                                    className="justify-self-end"
                                    onClick={() => {
                                        forceUpdate();
                                    }}
                                >
                                    Force Update SnailyCAD
                                </Button>
                            </CustomCard>
                        </div>
                    </CustomCard>
                </div>
            </ScrollArea>
        </>
    );
}
