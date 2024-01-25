import { exec } from "child_process";
let _processes: {
    instanceId: string;
    pid: number;
}[] = [];

export default class ManageProcess {
    static get processes() {
        return _processes;
    }

    static addProcess(instanceId: string, pid: number) {
        _processes.push({ instanceId, pid });
    }

    static removeProcess(instanceId: string) {
        _processes = _processes.filter(
            (process) => process.instanceId !== instanceId
        );
    }

    static getProcess(instanceId: string) {
        return _processes.find((process) => process.instanceId === instanceId);
    }

    static getProcessByPid(pid: number) {
        return _processes.find((process) => process.pid === pid);
    }

    static getProcessByInstanceId(instanceId: string) {
        return _processes.find((process) => process.instanceId === instanceId);
    }

    static killProcess(instanceId: string) {
        const found = _processes.find(
            (process) => process.instanceId === instanceId
        );
        if (found) {
            if (process.platform === "win32") {
                exec(`taskkill /PID ${found.pid} /T /F`);
                return;
            }
            process.kill(-found.pid, "SIGKILL");
        }

        _processes = _processes.filter(
            (process) => process.instanceId !== instanceId
        );
    }

    static killProcessByPid(pid: number) {
        const found = _processes.find((process) => process.pid === pid);
        if (found) {
            if (process.platform === "win32") {
                exec(`taskkill /PID ${found.pid} /T /F`);
                return;
            }

            process.kill(-found.pid, "SIGKILL");
        }

        _processes = _processes.filter((process) => process.pid !== pid);
    }

    static killAllProcesses() {
        _processes.forEach((itm) => {
            if (process.platform === "win32") {
                exec(`taskkill /PID ${itm.pid} /T /F`);
                return;
            }

            process.kill(-itm.pid, "SIGKILL");
        });

        _processes = [];
    }
}
