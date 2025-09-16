import oracledb from 'oracledb';

// Array to store all connections
let connections = [];

// Function to open a connection and add it to the array
async function openConnection() {
    try {
        let connection = await oracledb.getConnection({
            user: 'st_oracle_bft',
            password: 'Backflipt@st@123',
            connectString: 'database-1.cd2vwwbuesrp.us-east-1.rds.amazonaws.com:1521/ORCL'
        });   
        connections.push(connection);
        console.log('Connection opened successfully.');
    } catch (err) {
        console.error('Error opening connection:', err);
    }
}

// Function to close all connections in the array
async function closeAllConnections() {
    try {
        // Close each connection in the array
        await Promise.all(connections.map(conn => conn.close()));
        
        connections = []; // Clear the connections array
        
        console.log('All connections closed successfully.');
    } catch (err) {
        console.error('Error closing connections:', err);
    } finally {
        // Release any resources held by the oracledb module
        await oracledb.getPool().close(10);
    }
}

// Example usage:
async function runExample() {
    await openConnection();
    // Perform operations with open connections
    // Close connections when done
    await closeAllConnections();
}

runExample();

