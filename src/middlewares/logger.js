const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Logging level
  format: combine(
    colorize(), // Add colors to logs
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
    logFormat // Use custom log format
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
    new winston.transports.File({ filename: 'logs/combined.log' }) // Log all messages to file
  ],
});

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' })
);

// Handle unhandled promise rejections
logger.rejections.handle(
  new winston.transports.File({ filename: 'logs/rejections.log' })
);

module.exports = logger;