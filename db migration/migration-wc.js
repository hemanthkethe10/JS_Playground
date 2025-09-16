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
    new winston.transports.File({ filename: 'info.log', level: 'info' })
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
  connectString: 'database-1.cd2vwwbuesrp.us-east-1.rds.amazonaws.com:1521/ORCL'
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
    logger.info("Oracle pool is initialized")
  } catch (err) {
    logger.error('Error creating Oracle pool:', err);
  }
}

// Fetch data from MySQL
function fetchMySQLData(offset, limit, from, to, callback) {
  let query = `SELECT ${fields.join(', ')} FROM ${TABLE_NAME}`;
  switch (true) {
    case (from ?? '') !== '' && (to ?? '') !== '':
      query += ` WHERE EventTimeStamp >= ${from} AND EventTimeStamp <= ${to}`;
      break;
    case (from ?? '') !== '':
      query += ` WHERE EventTimeStamp >= ${from}`;
      break;
    case (to ?? '') !== '':
      query += ` WHERE EventTimeStamp <= ${to}`;
      break;
    default:
      // No action needed if both 'from' and 'to' are null or empty
      break;
  }
  query = query + ` ORDER BY EventTimeStamp ASC LIMIT ${limit} OFFSET ${offset}`
  logger.info(`Executing query ==> ${query}`)
  mysqlPool.query(query, (err, results) => {
    if (err) return callback(err);
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
        bindObj[field] = row[field];
      });
      return bindObj;
    });
   logger.info(`Inserting into oracle. No of records => ${data?.length}`)
    await connection.executeMany(sql, binds, { autoCommit: true });
    //successfully inserted
    callback(null);
  } catch (err) {
    logger.error('Error inserting data into Oracle:', err);
    callback(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        logger.error('Error closing Oracle connection:', err);
      }
    }
  }
}

// Migrate data in chunks
function migrateData(offset, limit, from , to, callback) {
  fetchMySQLData(offset, limit, from , to,  (err, data) => {
    logger.info(`Fetching data from MY SQL --> ${offset},${limit},${from},${to}`)
    if (err) return callback(err);
    insertIntoOracle(data, callback);
  });
}

// Main function to initialize pools and start migration
async function main() {
  let recordCount = 50000;  // Total number of records
  let chunkSize = 5000;  // Number of records to process in each chunk
  let from = '';
  let to = '';

  await initializeOraclePool();

  let tasks = [];
  for (let i = 0; i < recordCount; i += chunkSize) {
    tasks.push((callback) => migrateData(i, chunkSize, from ,to , callback));
  }

  async.parallelLimit(tasks, PARALLEL_TASKS , async (err) => {
    if (err) {
      logger.error('Error during migration:', err);
    } else {
      logger.info('Migration completed successfully.');
      console.log('Migration completed successfully.');
    }

    mysqlPool.end();
    try {
      logger.info("Closing the Oracle Pool")
      await oraclePool.close(0);
      } catch (err) {
          logger.error('Error closing Oracle pool:', err);
      }
  });
}

main();