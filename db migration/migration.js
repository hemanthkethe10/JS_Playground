import mysql from 'mysql2';
import oracledb from 'oracledb';
import async from 'async';
import winston from 'winston';

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'info.log', level: 'info' }),
    new winston.transports.Console({ level: 'debug' })  // Add console logging for better monitoring
  ]
});

let TABLE_NAME = 'historic_1353341185';
let PARALLEL_TASKS = 10;

// MySQL connection configuration
const mysqlConfig = {
  host: '44.195.182.71',
  user: 'user_sent',
  password: 'Sentinel_Backflipt@123',
  database: 'db_sent'
};

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

// List of fields to be migrated
const fields = [
  'SERVERNAME', 'FILEID', 'BUSINESSTAGS', 'ISPII', 'CLIENTNAME', 'ROUTELABEL', 
  'DATASENSITIVITY', 'INTERNALCYCLEID', 'ISPERMANENT', 'ISSERVER', 'ISSSL', 
  'LATESTDATE', 'LATESTTIME', 'LOCALID', 'LOCATION', 'MONITORVERSION', 
  'ORIGINALSENDERID', 'POSITIONNUMBER', 'PRIORITY', 'PROTOCOL', 'PROTOCOLFILELABEL', 
  'PROTOCOLFILENAME', 'PROTOCOLID', 'PROTOCOLMESSAGE', 'PROTOCOLPARAMETER', 'RAPPL', 
  'RECEIVERID', 'RECORDFORMAT', 'RECORDNUMBER', 'RECORDSIZE', 'REQUESTCREATIONDATE', 
  'REQUESTCREATIONTIME', 'REQUESTGROUPID', 'REQUESTTYPE', 'REQUESTUSERID', 
  'RETRYMAXNUMBER', 'RETRYNUMBER', 'RUSER', 'SAPPL', 'SENDERID', 'SITE', 'SSLAUTH', 
  'SSLCYPHER', 'STARTDATE', 'STARTTIME', 'SUSER', 'TRANSCODING', 'TRANSFERTYPE', 
  'TRANSLATIONTABLEID', 'TRANSMISSIONDURATION', 'TRANSMITTEDBYTES', 'TRUSTEE', 'USERID', 
  'USERPARAMETER1', 'USERPARAMETER2', 'USERPROCESSED', 'USERSTATE', 'VIRTUALDIRNAME', 
  'GROUPNAME', 'REQUESTJOBNAME', 'CGATEUSERPARAMETER1', 'CGATEUSERPARAMETER2', 
  'SESSIONTAG', 'TRANSFERTAG', 'LOCALADDR', 'LOCALSAP', 'REMOTEADDR', 'REMOTESAP', 
  'SWPOSSIBLEDUPLICATEIND', 'SWOVERDUETIMEDATE', 'SWOVERDUETIMETIME', 
  'SWASPRMACHECKRESULT', 'FLOWNAME', 'SOURCEAPPLICATION', 'TARGETAPPLICATION', 'ISRELAY', 
  'COMMUNITYPICKUP', 'SEQUENCEID', 'SEQUENCENUMBER', 'DOCUMENTTYPE', 'PARENTCYCLEID', 
  'NODEID', 'COREID', 'EVENTTIMESTAMP', 'ENVIRONMENTID', 'MONITOR', 'EVENTID', 
  'INTERNALSTATE', 'AGENTIPADDR', 'AGENTIPPORT', 'CYCLEID', 'EVENTDATE', 'EVENTTIME', 
  'GMTDIFF', 'ISALERT', 'ISARCHIVED', 'ISEND', 'ISEXCEPTION', 'OBJECTID', 'PRODUCTIPADDR', 
  'PRODUCTNAME', 'PRODUCTOS', 'RETURNCODE', 'RETURNMESSAGE', 'SEVERITY', 'STATE', 
  'TESTLABEL', 'USERCHILDID', 'USERNAME', 'USEROBJECTID', 'USERPARENTID', 'DATETIA', 
  'TIMETIA', 'USERTIA', 'DATEACK', 'TIMEACK', 'USERACK', 'COMMENTACK', 'DSTEVENTID', 
  'UPDATELABEL', 'ACKDATE', 'ACKTIME', 'APPLICATION', 'COMMANDTYPE', 'COMPRESSION', 
  'CREATIONDATE', 'CREATIONTIME', 'DIRECTION', 'EARLIESTDATE', 'EARLIESTTIME', 'ENDDATE', 
  'ENDTIME', 'EOTPROCEDURE', 'FILENAME', 'FILESIZE', 'FILETYPE', 'FINALRECEIVERID', 
  'GROUPID', 'IDAPPL','IDValue','Divison','PartnerName','SourceAccount','Classifier','Comments',
  'FileDescription','FileNamePattern'
];

// MySQL connection pool
const mysqlPool = mysql.createPool(mysqlConfig);

// Oracle connection pool
let oraclePool;
async function initializeOraclePool() {
  try {
    oraclePool = await oracledb.createPool(oracleConfig);
    logger.info("Oracle pool is initialized");
  } catch (err) {
    logger.error('Error creating Oracle pool:', err);
  }
}

// Fetch data from MySQL
function fetchMySQLData(offset, limit, from, to, callback) {
  let query = `SELECT ${fields.join(', ')} FROM ${TABLE_NAME}`;
  if (from && to) {
    query += ` WHERE EventTimeStamp >= ${from} AND EventTimeStamp <= ${to}`;
  } else if (from) {
    query += ` WHERE EventTimeStamp >= ${from}`;
  } else if (to) {
    query += ` WHERE EventTimeStamp <= ${to}`;
  }
  query += ` ORDER BY EventTimeStamp ASC LIMIT ${limit} OFFSET ${offset}`;
  logger.info(`Executing query ==> ${query}`);
  mysqlPool.query(query, (err, results) => {
    if (err) {
      logger.error('Error fetching data from MySQL:', err);
      return callback(err);
    }
    callback(null, results);
  });
}

// Insert data into Oracle
async function insertIntoOracle(data, callback) {
  let connection;
  try {
    connection = await oraclePool.getConnection();
    const sql = `INSERT INTO ${TABLE_NAME} (${fields.join(', ')}) VALUES (${fields.map(field => `:${field}`).join(', ')})`;
    const binds = data.map(row => {
      const bindObj = {};
      fields.forEach(field => {
        bindObj[field] = row[field] !== undefined ? row[field] : null;
      });
      return bindObj;
    });
    logger.info(`Inserting into Oracle. Number of records => ${data?.length}`);
    await connection.executeMany(sql, binds, { autoCommit: true });
    logger.info(`Migrated Successfully for records`);
    callback(null);
  } catch (err) {
    logger.error('Error inserting data into Oracle:', err);
    callback(err);
  } finally {
    if (connection) {
      try {
        logger.info('Closing Oracle connection');
        await connection.close();
      } catch (err) {
        logger.error('Error closing Oracle connection:', err);
      }
    }
  }
}

// Migrate data in chunks
function migrateData(offset, limit, from, to, callback) {
  fetchMySQLData(offset, limit, from, to, (err, data) => {
    logger.info(`Fetching data from MySQL --> ${offset},${limit},${from},${to}`);
    if (err) return callback(err);
    if (data.length === 0) {
      logger.info('No data fetched, ending migration.');
      return callback(null);
    }
    insertIntoOracle(data, callback);
  });
}

async function fetchOracleLastRecordTimestamp() {
  let connection;
  try {
    connection = await oracledb.getConnection(oracleConfig);
    const query = `SELECT EventTimestamp FROM ${TABLE_NAME} WHERE EventTimestamp IS NOT NULL ORDER BY EventTimestamp DESC FETCH FIRST 1 ROWS ONLY`;
    const result = await connection.execute(query);
    if (result.rows.length > 0) {
      const lastRecordTimestamp = result.rows[0][0];
      return lastRecordTimestamp;
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error fetching last record timestamp:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Main function to initialize pools and start migration
async function main() {
  let lastRunTimeStamp = await fetchOracleLastRecordTimestamp()
  let recordCount = 20;  // Total number of records
  let chunkSize = 2;  // Number of records to process in each chunk
  let from = (lastRunTimeStamp) ? parseInt(lastRunTimeStamp) + 1 : '';
  let to = '';
  logger.info("Params",recordCount,chunkSize,from,to);
  await initializeOraclePool();

  let tasks = [];
  for (let i = 0; i < recordCount; i += chunkSize) {
    tasks.push((callback) => migrateData(i, chunkSize, from, to, callback));
  }

  async function closePools() {
    await new Promise((resolve, reject) => {
      mysqlPool.end((err) => {
        if (err) {
          logger.error("Error closing MySQL pool:", err);
          reject(err);
        } else {
          logger.info("MySQL pool has been closed.");
          resolve();
        }
      });
    });
  
    await new Promise((resolve, reject) => {
      oraclePool.close((err) => {
        if (err) {
          logger.error("Error closing Oracle pool:", err);
          reject(err);
        } else {
          logger.info("Oracle pool has been closed.");
          resolve();
        }
      });
    });
  }
  
  async.parallelLimit(tasks, PARALLEL_TASKS, (err) => {
    if (err) {
      logger.error('Error during migration:', err);
    } else {
      logger.info('Migration completed successfully.');
    }
  
    closePools().catch((err) => {
      logger.error('Error closing pools:', err);
    });
  });
  
  
  return null;
}

main()
//383015