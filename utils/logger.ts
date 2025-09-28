// Logger utility for the application
// Provides environment-aware logging that can be easily controlled

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
}

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const requestedLevelIndex = levels.indexOf(level);
    
    return requestedLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };
  }

  private log(level: LogLevel, message: string, context?: any): void {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(level, message, context);
    
    // In development, use console methods for better formatting
    if (this.isDevelopment) {
      const formattedMessage = `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`;
      const contextInfo = context ? ` ${JSON.stringify(context)}` : '';
      
      // Use console.log for all levels to avoid ESLint console restrictions
      // eslint-disable-next-line no-console
      console.log(formattedMessage + contextInfo);
    }
    
    // In production, you could send logs to a service like LogRocket, Sentry, etc.
    // For now, we'll suppress console output in production
  }

  debug(message: string, context?: any): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: any): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: any): void {
    this.log('error', message, context);
  }

  // Convenience method for API errors
  apiError(message: string, error: any, endpoint?: string): void {
    this.error(message, {
      error: error instanceof Error ? error.message : error,
      endpoint,
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

// Create and export singleton logger instance
export const logger = new Logger();

// Export type for external use
export type { LogLevel, LogEntry };