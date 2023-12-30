import { io } from "socket.io-client";

const URL =
    process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

// @ts-ignore
const socket = io(URL, { autoConnect: false });

export default socket;
