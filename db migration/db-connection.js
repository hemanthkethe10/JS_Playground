import mysql from 'mysql2/promise';

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: '44.195.182.71',
  user: 'user_sent',
  password: 'Sentinel_Backflipt@123',
  database: 'db_sent',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function executeQuery(){
try {
    // For pool initialization, see above
    const [rows, fields] = await pool.query('select * from xfbtransfer_h xh limit 1');
    console.log(JSON.stringify(rows))
    // Connection is automatically released when query resolves
  } catch (err) {
    console.log(err);
  }
}

executeQuery()