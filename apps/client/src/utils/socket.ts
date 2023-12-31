import { io } from "socket.io-client";

const URL =
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000";

const socket = io(URL, { autoConnect: false });

export default socket;
