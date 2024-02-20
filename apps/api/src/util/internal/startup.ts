import type { StartData } from "@scm/types";
import { fireStart } from "../../sockets/start-instance";
import ManageDatabase from "../database";
import ManageProcess from "../manageProcess";

export default async function Startup() {
    const instances = await ManageDatabase.instances.getInstances();

    for (const instance of instances) {
        if (!ManageProcess.getProcessByInstanceId(instance.id)) {
            if (!instance.settings.autoStart) {
                continue;
            }

            await fireStart({
                id: instance.id,
                build: true,
            } as StartData);
        }
    }
}
