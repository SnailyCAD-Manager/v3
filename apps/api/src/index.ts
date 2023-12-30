import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";

// Create a new express app that runs a socket.io server that accepts traffic from any origin
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.get("/", (req, res) => {
    if (process.env.NODE_ENV === "production") {
        res.sendFile(path.resolve(process.cwd(), "../../client/index.html"));
    } else {
        res.redirect("http://localhost:5173");
    }
});

// Listen for incoming connections
io.on("connection", (socket) => {
    console.log(`New Client: ${socket.id}`);

    // Listen for "message" events from the client
    socket.on("message", (message) => {
        console.log("Message received: ", message);

        // Broadcast the message to all connected clients
        io.emit("message", message);
    });

    // Listen for "disconnect" events from the client
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
