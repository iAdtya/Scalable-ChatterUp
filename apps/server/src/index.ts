import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/Kafka";

async function init() {
  await startMessageConsumer();
  const socketService = new SocketService();

  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () =>
    console.log(`HTTP Server started at PORT:${PORT}`)
  );

  socketService.initListeners();
}

init();
