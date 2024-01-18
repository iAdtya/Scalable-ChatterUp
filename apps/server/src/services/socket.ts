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

class SocketService {
  private _io: Server;

  constructor() {
    console.log("SocketService constructor Intialized");
    this._io = new Server({
      cors: {
        allowedHeaders: "*",
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("initListeners Intialized");
    io.on("connect", (socket) => {
      console.log("New Socket Connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Recieved", ">>>", message);
        //publish this  message to redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("New Message Published", ">>>", message);
        io.emit("message", message);
        //? save this message to database
        // await prismaClient.message.create({
        //   data: {
        //     text: message,
        //   },
        // });
        //? publish this message to kafka
        await produceMessage(message);
        console.log("Message Published to Kafka", ">>>", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
