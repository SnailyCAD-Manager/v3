import { StartData } from "@scm/types";
import ManageDatabase from "../database";
import ManageProcess from "../manageProcess";
import { fireStart } from "../../sockets/start-instance";

export default async function Startup() {
    const instances = ManageDatabase.instances.getInstances();

    for (const instance of instances) {
        if (!ManageProcess.getProcessByInstanceId(instance.id)) {
            console.log(`Auto Start: ${instance.name} (ID: ${instance.id})`);

            await fireStart({
                id: instance.id,
                build: true,
            } as StartData);
        }
    }
}
