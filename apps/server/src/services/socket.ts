import { Server } from "socket.io";
import Redis from "ioredis";
import prismaClient from "./prisma";
import { produceMessage } from "./Kafka";

const pub = new Redis({
  host: "redis-68b7ea3-adityakhedekar98906-a6ac.a.aivencloud.com",
  port: 16633,
  username: "default",
  password: "AVNS_fWyaEhwXhDWWazHFC1A",
});

const sub = new Redis({
  host: "redis-68b7ea3-adityakhedekar98906-a6ac.a.aivencloud.com",
  port: 16633,
  username: "default",
  password: "AVNS_fWyaEhwXhDWWazHFC1A",
});

let _io: Server;

const initSocketService = () => {
  console.log("SocketService constructor Intialized");
  _io = new Server({
    cors: {
      allowedHeaders: "*",
      origin: "*",
    },
  });
  sub.subscribe("MESSAGES");
  initListeners();
};

const getIo = () => _io;

const initListeners = () => {
  console.log("initListeners Intialized");
  _io.on("connect", (socket) => {
    console.log("New Socket Connected", socket.id);

    socket.on(
      "event:message",
      async ({ id, message }: { id: string; message: string }) => {
        console.log("Received id:", id);
        console.log("New Message Recieved", ">>>", message);
        await pub.publish("MESSAGES", JSON.stringify({ id, message }));
      }
    );
  });

  sub.on("message", async (channel, message) => {
    if (channel === "MESSAGES") {
      console.log("New Message Published", ">>>", message);
      _io.emit("message", message);
      await produceMessage(message);
      console.log("Message Published to Kafka", ">>>", message);
    }
  });
};

export { initSocketService, getIo };
