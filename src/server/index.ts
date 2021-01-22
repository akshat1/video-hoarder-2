import { getLogger } from "../common/logger";
import { getConfig } from "./config";
import { initialize as initializeDB } from "./db";
import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";
import fs from "fs";
import http from "http";
import path from "path";
import { requestLogger } from "./express-middleware";
import { bootstrap as bootstrapPassport, getPassport } from "./getPassport";
import { getRouter as getAPI } from "./api";


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
  // init db
  logger.debug("Initialize DB");
  await initializeDB();
  // start server
  // Note: config.serverPath is for the frontend. The translation from <your domain>/serverPath to "/" will happen in your proxy server (which is nginx for most people).
  const serverPath = "/";
  logger.debug({ serverPath, serverPort });
  const app:Application = express();
  app.use(requestLogger);
  app.use(bodyParser.json());
  // TODO: We'll have to figure this out
  // app.use(path.join(serverPath, "/static/"), express.static("./dist"));
  const server = http.createServer(app);

  logger.debug("bootstrap passport");
  bootstrapPassport({ app });
  app.use(path.join(serverPath, "api"), getAPI(getPassport()));

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
