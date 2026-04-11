/**
 * API request/response logging utility
 * Logs API calls for monitoring, debugging, and audit purposes
 */

export interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  status?: number;
  duration?: number;
  userId?: string;
  error?: string;
}

class RequestLogger {
  private logs: RequestLog[] = [];
  private maxLogs = 500;
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log an API request
   */
  logRequest(
    method: string,
    path: string,
    options?: { userId?: string }
  ): { id: string; startTime: number } {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const startTime = performance.now();

    if (this.isDevelopment) {
      console.log(`[API] ${method} ${path}${options?.userId ? ` (user: ${options.userId})` : ''}`);
    }

    return { id, startTime };
  }

  /**
   * Log request completion
   */
  logResponse(
    method: string,
    path: string,
    status: number,
    startTime: number,
    options?: { userId?: string }
  ): void {
    const duration = Math.round(performance.now() - startTime);
    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      method,
      path,
      status,
      duration,
      ...(options?.userId && { userId: options.userId }),
    };

    this.addLog(log);

    // Log error responses
    if (status >= 400) {
      console.warn(`[API] ${method} ${path} - ${status} (${duration}ms)`);
    } else if (this.isDevelopment) {
      console.log(`[API] ${method} ${path} - ${status} (${duration}ms)`);
    }
  }

  /**
   * Log an error that occurred during request handling
   */
  logError(
    method: string,
    path: string,
    error: unknown,
    startTime: number,
    options?: { userId?: string }
  ): void {
    const duration = Math.round(performance.now() - startTime);
    const errorMessage = error instanceof Error ? error.message : String(error);

    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      method,
      path,
      duration,
      error: errorMessage,
      ...(options?.userId && { userId: options.userId }),
    };

    this.addLog(log);
    console.error(`[API Error] ${method} ${path} - ${errorMessage} (${duration}ms)`);
  }

  /**
   * Add log entry (with size management)
   */
  private addLog(log: RequestLog): void {
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Get logs for specific endpoint
   */
  getLogsForEndpoint(path: string): RequestLog[] {
    return this.logs.filter((log) => log.path === path);
  }

  /**
   * Get all logs
   */
  getAllLogs(): RequestLog[] {
    return [...this.logs];
  }

  /**
   * Get error logs
   */
  getErrorLogs(): RequestLog[] {
    return this.logs.filter((log) => log.error);
  }

  /**
   * Get slow requests (> threshold ms)
   */
  getSlowRequests(thresholdMs = 1000): RequestLog[] {
    return this.logs.filter((log) => log.duration && log.duration > thresholdMs);
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get statistics
   */
  getStats() {
    const recentLogs = this.logs.slice(-100);
    const errors = recentLogs.filter((l) => l.error).length;
    const avgDuration =
      recentLogs.length > 0
        ? Math.round(
            recentLogs.reduce((sum, l) => sum + (l.duration ?? 0), 0) / recentLogs.length
          )
        : 0;

    return {
      totalLogs: this.logs.length,
      recentRequestsCount: recentLogs.length,
      recentErrorCount: errors,
      averageDurationMs: avgDuration,
    };
  }
}

export const requestLogger = new RequestLogger();
