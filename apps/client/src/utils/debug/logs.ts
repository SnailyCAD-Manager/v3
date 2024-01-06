const logs = {
    success: (message: string) => {
        console.log(`%c${message}`, "color: green;");
    },
    error: (message: string) => {
        console.log(`%c${message}`, "color: red;");
    },
    warning: (message: string) => {
        console.log(`%c${message}`, "color: orange;");
    },
    info: (message: string) => {
        console.log(`%c${message}`, "color: skyblue;");
    },
};

export default logs;
