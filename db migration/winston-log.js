import winston from 'winston';

// Configure winston logger
const logger = winston.createLogger({
  level: 'info', // Only log info level and below
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'info.log', level: 'info' })
  ]
});

function fetchData(){
    logger.info("First Statement")
    logger.info("Second Statement")
    logger.error("Error Statement")
}

fetchData();
