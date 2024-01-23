import { Server } from "socket.io";
import Redis from "ioredis";
import { produceMessage } from "./Kafka";
import { PostHog } from "posthog-node";

const client = new PostHog("phc_S8xmfQP8rJsrzipKD19mzmmtnk860wodgvpoU9bXNcq", {
  host: "https://us.posthog.com",
});

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
      origin: "https://scalable-chatter-up.vercel.app/",
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
    client.capture({
      distinctId: `user-${socket.id}`,
      event: "Message Published",
    });
  });
  client.flush();

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
