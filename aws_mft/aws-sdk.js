const { TransferClient, ListServersCommand, DescribeServerCommand } = require("@aws-sdk/client-transfer");
require('dotenv').config({ path: '../.env' });

async function listServers() {
  // 1. Configure the client
  const client = new TransferClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,            
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  
    }
  });

  const command = new ListServersCommand({
    MaxResults: 1,
  });

  try {
    const response = await client.send(command);
    console.log("ListServers Success:", JSON.stringify(response));
  } catch (err) {
    console.error("Error calling ListServers:", err);
  }
}

listServers();
