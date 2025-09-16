const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config({ path: '../.env' });

async function deleteObject(input) {
  try {
const s3Client = new S3Client({region: "us-east-1",
  credentials:{
    accessKeyId: input.accessKey,            
    secretAccessKey: input.secretKey,  
  }});
    const command = new DeleteObjectCommand({
      Bucket: input.bucketName,
      Key:input.fileKey
    });
    const awsResponse = await s3Client.send(command);
    console.log("awsResponse",awsResponse)
    return {
            hasErrors: false,
            result: awsResponse
          };
  } catch (err) {
    return {
            hasErrors: true,
            error: err
          };
  }
}


let input = {
    accessKey: process.env.AWS_ACCESS_KEY_ID ,            
    secretKey: process.env.AWS_SECRET_ACCESS_KEY ,
  bucketName: "backflipt-sftp-bucket-us-east",
  fileKey: "hemanth/Holiday List Renamed - 2023.docx"
}
console.log(deleteObject(input))