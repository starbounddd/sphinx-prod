// Logging utilities
export function log(level: string, message: string, data?: unknown) {
  // Logging implementation
  console.log(`[${level}] ${message}`, data);
}

export function debug(message: string, data?: unknown) {
  log('DEBUG', message, data);
}

export function info(message: string, data?: unknown) {
  log('INFO', message, data);
}

export function warn(message: string, data?: unknown) {
  log('WARN', message, data);
}

export function error(message: string, data?: unknown) {
  log('ERROR', message, data);
}
