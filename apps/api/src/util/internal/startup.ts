import { StartData } from "@scm/types";
import ManageDatabase from "../database";
import ManageProcess from "../manageProcess";
import { fireStart } from "../../sockets/start-instance";

export default async function Startup() {
    const instances = await ManageDatabase.instances.getInstances();

    for (const instance of instances) {
        if (!ManageProcess.getProcessByInstanceId(instance.id)) {
            if (!instance.settings.autoStart) {
                console.log(
                    `Skipping Auto Start: ${instance.name} (Not configured to auto start)`
                );
                continue;
            }

            console.log(`Auto Start: ${instance.name} (ID: ${instance.id})`);

            await fireStart({
                id: instance.id,
                build: true,
            } as StartData);
        }
    }
}
