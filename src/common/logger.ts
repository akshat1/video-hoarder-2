/**
 * @module logger
 */

enum Priority {
  log = 6,   // Use this for stuff you always want to log.
  error = 5,
  warn = 4,
  info = 3,
  debug = 2,
  all = -1,
}

export interface Logger {
  _shouldLog(level: Priority): boolean,
  getName() : string,
  setLevel(level:Priority): void,
  debug(...messages: any[]): void,
  error(...messages: any[]): void,
  info(...messages: any[]): void,
  log(...messages: any[]): void,
  warn(...messages: any[]): void,
}

/**
 * Get a new Logger instance.
 */
export const getLogger = (name: string, parentLogger?: Logger): Logger => {
  const fullName = parentLogger ? `${parentLogger.getName()}:${name}` : name;
  const stub = `[${fullName}]`;
  let loggerLevel = Priority.debug;
  const _shouldLog = (level:Priority) => {
    return Priority[level] >= Priority[loggerLevel] && (!parentLogger || parentLogger._shouldLog(level));
  };

  const instance = {
    _shouldLog,
    setLevel: (level: Priority) => loggerLevel = level,
    getName: () => fullName,
    debug: (...messages: any[]) => _shouldLog(Priority.debug) && console.debug(stub, ...messages),
    error: (...messages: any[]) => _shouldLog(Priority.error) && console.error(stub, ...messages),
    info: (...messages: any[]) => _shouldLog(Priority.info) && console.info(stub, ...messages),
    log: (...messages: any[]) => _shouldLog(Priority.log) && console.log(stub, ...messages),
    warn: (...messages: any[]) => _shouldLog(Priority.warn) && console.warn(stub, ...messages),
  };

  return instance;
};
