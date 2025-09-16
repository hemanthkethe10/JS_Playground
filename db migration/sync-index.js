import oracledb from 'oracledb';
import winston from 'winston';

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'syncIndex.log', level: 'info' }),
    new winston.transports.Console({ level: 'debug' })  // Add console logging for better monitoring
  ]
});

let index = 'IDX_TEXT_STATE';
// Oracle connection configuration
const oracleConfig = {
  user: 'st_oracle_bft',
  password: 'Backflipt@st@123',
  connectString: 'database-1.cd2vwwbuesrp.us-east-1.rds.amazonaws.com:1521/ORCL',
  queueTimeout: 300000,
  poolTimeout: 300000,
  poolMax: 10,
  poolMin: 5,
  poolIncrement: 1,
  poolTimeout: 60
};

// Function to sync text index
async function syncTextIndex() {
  let connection;
  try {
    // Get a connection from the pool
    connection = await oracledb.getConnection(oracleConfig);

    const query = `
      BEGIN
        CTX_DDL.SYNC_INDEX('${index}');
      END;
    `;

    // Execute the PL/SQL block
    const result = await connection.execute(query);

    // No rows are expected from the PL/SQL block execution
    logger.info('Text index synchronized successfully',result);
  } catch (err) {
    logger.error('Error syncing text index:', err);
    throw err;
  } finally {
    // Close the connection
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        logger.error('Error closing connection:', err);
      }
    }
  }
}

// Call the function to sync the text index
syncTextIndex().catch(err => {
    logger.error('Unexpected error:', err);
});
