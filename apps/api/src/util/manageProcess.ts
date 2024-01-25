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
            process.kill(found.pid);
        }

        _processes = _processes.filter(
            (process) => process.instanceId !== instanceId
        );
    }

    static killProcessByPid(pid: number) {
        const found = _processes.find((process) => process.pid === pid);
        if (found) {
            process.kill(found.pid);
        }

        _processes = _processes.filter((process) => process.pid !== pid);
    }

    static killAllProcesses() {
        _processes.forEach((itm) => {
            process.kill(itm.pid);
        });

        _processes = [];
    }
}
