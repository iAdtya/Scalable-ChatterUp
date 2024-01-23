import http from "http";
import { initSocketService, getIo } from "./services/socket";
import { startMessageConsumer } from "./services/Kafka";
import { error } from "console";

async function init() {
  await startMessageConsumer();
  initSocketService();

  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  getIo().attach(httpServer);

  httpServer.listen(PORT, () =>
    console.log(`HTTP Server started at PORT:${PORT}`)
  );
}

init();
