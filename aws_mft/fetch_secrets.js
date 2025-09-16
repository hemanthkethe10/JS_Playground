const {SecretsManager} = require( "@aws-sdk/client-secrets-manager")
const { Transfer } = require("@aws-sdk/client-transfer");
const {S3 } = require("@aws-sdk/client-s3")
// const { Lambda } = require("@aws-sdk/client")
require('dotenv').config({ path: '../.env' });

  
const secret_name = "aws/transfer/sftp-connector-1";

const s3Client = new S3({region: process.env.AWS_REGION || "us-east-1",
  credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,            
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  
  }});

  const SecretsManagerClient = new SecretsManager({region: process.env.AWS_REGION || "us-east-1",
    credentials:{
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,            
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,  
  }})
  
  // const client = new SecretsManagerClient({
  //   region: "<AWS_REGION>",
  //   credentials: {
  //       accessKeyId: "<AWS_ACCESS_KEY_ID>",            
  //       secretAccessKey: "<AWS_SECRET_ACCESS_KEY>",  
  //     }
  // });
  
  let response;
  async function getSecret() {
  try {
    response = await SecretsManagerClient.getSecretValue({"SecretId": secret_name, "VersionStage": "AWSCURRENT"})  // VersionStage defaults to AWSCURRENT if unspecified  //  })
    // await client.send(
    //   new GetSecretValueCommand({
    //     SecretId: secret_name,
    //     VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
    //   })
    // );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }
  
  const secret = response;
  console.log("Secret retrieved:", secret);
  return secret;
}

const transferClient = new Transfer(
  {'region': process.env.AWS_REGION || 'us-east-1',
    'credentials':{    
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,            
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
 }});

//  const lambdaClient = new Lambda(  
//   {'region':'<AWS_REGION>',
//   'credentials':{    
// accessKeyId: "<AWS_ACCESS_KEY_ID>",            
// secretAccessKey: "<AWS_SECRET_ACCESS_KEY>" 
// }})
//  transferClient.sendWorkflowStepState()
 async function listWorkFlows(){
  const workflows = await transferClient.listWorkflows({"MaxResults": 10});
  console.log("Workflows retrieved:", workflows);
  return workflows
 }

 async function describeWorkFlow(workflowId){
  const response = await transferClient.describeWorkflow({"WorkflowId":workflowId});
  console.log("Workflow details retrieved:", JSON.stringify(response));
  return response;
 }
  
  // console.log("Secret retrieved successfully:", listWorkFlows());
  // console.log("Workflow details retrieved successfully:", describeWorkFlow("w-985c4d9354415eb19"));

async function describeWorkFlow(){
  const response = await transferClient.describeWorkflow({"WorkflowId":"w-95da5eb7260bbfd96"});
  console.log("Workflow details retrieved:", JSON.stringify(response));
  return response;
}

// lambdaClient
// console.log("Workflow details retrieved successfully:", describeWorkFlow());

async function startFileTransfer(){
  const response = await transferClient.startFileTransfer(
    {
    ConnectorId:"c-a8f3f15104984fcf9",
    // SendFilePaths:['/backflipt-sftp-bucket/hemanth/Animals.pdf'],
    RetrieveFilePaths:['/st-files/1685-695.pdf'],
    LocalDirectoryPath:"/backflipt-sftp-bucket-us-east/backflipt",
    // RemoteDirectoryPath:"/st-files"
  })
  console.log("File transfer started:", JSON.stringify(response));
  //aws transfer start-directory-listing --region us-east-1 --connector-id c-a8f3f15104984fcf9 --remote-directory-path /testawsmft/files --output-directory-path /backflipt-sftp-bucket-us-east/backflipt
  return response
}

async function listFileTransferResults(connectorId,transferId){
  const response = await transferClient.listFileTransferResults(
    {
    MaxResults: 2,
    ConnectorId:connectorId,
    TransferId: transferId,
    // NextToken: "string"
  })
  console.log("File transfer results retrieved:", JSON.stringify(response));
  return response
}

async function listDirectories(connectorId){
  const response = await transferClient.startDirectoryListing({
    ConnectorId:connectorId,
    RemoteDirectoryPath:'/st-files',
    OutputDirectoryPath:'/backflipt-sftp-bucket-us-east/backflipt'
  })
  console.log("Directory listing retrieved:", JSON.stringify(response));
  return response
}
// console.log("File transfer started successfully:", listFileTransferResults("c-a8f3f15104984fcf9","8f022fff-9063-46c3-a355-46e06d40e4cb"));

// console.log('File transfer started successfully:', startFileTransfer());

// console.log('Directory listing retrieved successfully:', listDirectories("c-a8f3f15104984fcf9"));


async function getS3Object(){
  response = await s3Client.getObject(
    {
    Bucket: "backflipt-sftp-bucket-us-east",
    Key: "hemanth/Animals.pdf"
  })
  console.log("Object retrieved successfully:", response)
  return response
}

async function updateS3Object(){
  response = await s3Client.copyObject(
    {
    Bucket: "backflipt-sftp-bucket-us-east",
    Key: "hemanth/copied-Animals.pdf",
    CopySource:  "backflipt-sftp-bucket-us-east/hemanth/Animals.pdf"
  }
  )
  console.log("Object updated successfully:", response)
  return response
}

async function deleteS3Object(){
  response = await s3Client.deleteObject(
    {
    Bucket: "backflipt-sftp-bucket-us-east",
    Key: "hemanth/Animals.pdf"
  }
  )
  console.log("Object deleted successfully:", response)
  return response
}
async function getTags(){
const resp = await s3Client.getObjectTagging({Bucket:'backflipt-sftp-bucket-us-east', Key:'hemanth/copied-Animals.pdf'})
console.log('Object Tags:', resp)
return resp
}

async function updateTags(){
  const currentTags = (await getTags()).TagSet
  currentTags.push({'Key':'name4', 'Value':'tag4'})
  console.log('Current Tags:', currentTags)
  const resp = await s3Client.putObjectTagging(
    {
      Bucket:'backflipt-sftp-bucket-us-east', 
      Key:'hemanth/copied-Animals.pdf',
      'Tagging':{"TagSet":currentTags}
    }
  )
  console.log('Put Tags:', resp)
  return resp
}

// console.log('Object retrieved successfully:', deleteS3Object());
// console.log('Tags Function called:', updateTags());

async function getServers(){
  response = await transferClient.listServers(
    {
    MaxResults: 10,
    // NextToken: "string"
  })
  console.log("Servers retrieved:", JSON.stringify(response));
  return response
}

async function describeServer(serverId){
  response = await transferClient.describeServer(
    {
    ServerId:serverId,
    // NextToken: "string"
  })
  console.log("Server details retrieved:", JSON.stringify(response));
  return response
}

async function getServerUsers(serverId){
  response = await transferClient.listUsers(
    {
    ServerId:serverId,
    MaxResults: 10,
    // NextToken: "string"
  })
  console.log("Server users retrieved:", JSON.stringify(response));
  return response
}
// console.log("Servers retrieved successfully:", getServers());
// console.log("Servers retrieved successfully:", getServerUsers("s-3121c525fa5949489"));
console.log("Server details retrieved successfully:", describeServer("s-3121c525fa5949489"));

async function listBuckets(){
  const response = await s3Client.listBuckets();
  console.log("Buckets retrieved:", JSON.stringify(response));
  return response
}

// console.log("Buckets retrieved successfully:", listBuckets());