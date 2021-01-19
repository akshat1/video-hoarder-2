import { getLogger } from "../common/logger";
import { getConfig } from "./config";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";
import fs from "fs";
import http from "http";
import path from "path";


const rootLogger = getLogger("server");

process.on("unhandledRejection", (reason: any, p: Promise<any>) => {
  getLogger("process.unhandledRejection", rootLogger)
    .error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

export const startServer = async (): Promise<void> => {
  const logger = getLogger("startServer", rootLogger);
  const config = getConfig();
  logger.debug("Got config:", config);
  const { serverPort } = config;
  // Note: config.serverPath is for the frontend. The translation from <your domain>/serverPath to "/" will happen in your proxy server (which is nginx for most people).
  const serverPath = "/";
  logger.debug({ serverPath, serverPort });
  // init db
  // start server
  const app:Application = express();
  const server = http.createServer(app);
  const onServerStart = () => {
    /* istanbul ignore next because we are not testing whether this callback is called */
    logger.info(`App listening on port ${serverPort}, at "${serverPath}"`);
  };
  server.listen(serverPort, onServerStart);
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  getLogger("index.ts").debug("Gonna run the server...")
  startServer();
}
