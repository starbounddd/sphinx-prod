// Logging utilities
export function log(level: string, message: string, data?: any) {
  // Logging implementation
  console.log(`[${level}] ${message}`, data)
}

export function debug(message: string, data?: any) {
  log('DEBUG', message, data)
}

export function info(message: string, data?: any) {
  log('INFO', message, data)
}

export function warn(message: string, data?: any) {
  log('WARN', message, data)
}

export function error(message: string, data?: any) {
  log('ERROR', message, data)
}
