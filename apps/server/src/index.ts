import http from "http";
import { initSocketService, getIo } from "./services/socket";
import { startMessageConsumer } from "./services/Kafka";
import cluster from "cluster";
import os from "os";

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

if (cluster.isPrimary) {
  const numCPUs = os.availableParallelism();
  console.log(`Number of CPUs is ${numCPUs}`);
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  init();

  console.log(`Worker ${process.pid} started`);
}
