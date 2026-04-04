'use client';

/**
 * Application Error Logger
 * Centralized error logging with environment-aware behavior
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  module: string;
  message: string;
  data?: unknown;
  userAgent?: string;
}

class AppLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  private formatLog(entry: LogEntry): string {
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.module}] ${entry.message}`;
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    // Keep only recent logs to prevent memory issues
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory = this.logHistory.slice(-this.maxHistorySize);
    }
  }

  log(level: LogLevel, module: string, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      timestamp: this.getCurrentTimestamp(),
      module,
      message,
      data,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    this.addToHistory(entry);
    const formattedMessage = this.formatLog(entry);

    switch (level) {
      case 'debug':
        if (this.isDevelopment) console.debug(formattedMessage, data);
        break;
      case 'info':
        console.info(formattedMessage, data);
        break;
      case 'warn':
        console.warn(formattedMessage, data);
        break;
      case 'error':
        console.error(formattedMessage, data);
        break;
    }
  }

  debug(module: string, message: string, data?: unknown): void {
    this.log('debug', module, message, data);
  }

  info(module: string, message: string, data?: unknown): void {
    this.log('info', module, message, data);
  }

  warn(module: string, message: string, data?: unknown): void {
    this.log('warn', module, message, data);
  }

  error(module: string, message: string, data?: unknown): void {
    this.log('error', module, message, data);
  }

  getLogHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logHistory, null, 2);
    }

    // CSV format
    const headers = ['timestamp', 'level', 'module', 'message', 'data'];
    const rows = this.logHistory.map((entry) => [
      entry.timestamp,
      entry.level,
      entry.module,
      entry.message,
      JSON.stringify(entry.data || ''),
    ]);

    return [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  }
}

export const appLogger = new AppLogger();

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Structured error handler for API responses
 */
export function createErrorResponse(code: string, message: string, details?: unknown) {
  appLogger.error('API', `Error: ${code}`, { message, details });

  return {
    ok: false,
    error: {
      code,
      message,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
    },
  };
}

/**
 * Wrap async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  module: string,
  operationName: string
): Promise<{ ok: true; data: T } | { ok: false; error: AppError }> {
  try {
    appLogger.debug(module, `Starting: ${operationName}`);
    const data = await operation();
    appLogger.debug(module, `Completed: ${operationName}`);
    return { ok: true, data };
  } catch (error) {
    const appError
      = error instanceof AppError
        ? error
        : new AppError('INTERNAL_ERROR', `${operationName} failed`, error);

    appLogger.error(module, `Failed: ${operationName}`, appError);
    return { ok: false, error: appError };
  }
}
