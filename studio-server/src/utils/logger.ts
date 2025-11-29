import fs from 'fs';
import path from 'path';
import { env } from '@/config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
}

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private logDir: string;
  private currentLevel: LogLevel;

  constructor() {
    this.logDir = env.logDir;
    this.currentLevel = (env.logLevel as LogLevel) || 'info';

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private writeLog(entry: LogEntry): void {
    const timestamp = entry.timestamp.split('T')[0];
    const logFile = path.join(this.logDir, `${entry.level}-${timestamp}.log`);

    const line = JSON.stringify(entry) + '\n';
    fs.appendFileSync(logFile, line);
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.currentLevel];
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const entry = this.formatEntry(level, message, data);
    this.writeLog(entry);

    // Also console log in development
    if (env.isDevelopment) {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
      if (data) {
        console.log(prefix, message, data);
      } else {
        console.log(prefix, message);
      }
    }
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | any, data?: any): void {
    if (error instanceof Error) {
      this.log('error', message, { ...data, stack: error.stack });
    } else {
      this.log('error', message, error);
    }
  }
}

export const logger = new Logger();
