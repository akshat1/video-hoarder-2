import DefaultConfig from "../common/DefaultConfig";
import fs from "fs";
import _ from "lodash";
import path from "path";

interface Config {
  serverPath: string
  serverPort: number
}

let finalConfig: Config;

export const getConfig = ():Config => {
  if (!finalConfig) {
    const configPath = path.join(process.cwd(), "config.json");
    const localConfigExists = fs.existsSync(configPath);
    let loadedConfig = {};
    if (localConfigExists) {
      const buffer = fs.readFileSync(configPath);
      loadedConfig = JSON.parse(buffer.toString());
    }

    finalConfig = {
      ...DefaultConfig,
      ...loadedConfig,
    };
  }

  return finalConfig;
};

export const getConfigValue = (keyPath: string): any =>
  _.get(getConfig(), keyPath);
