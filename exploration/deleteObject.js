const { S3Client, DeleteObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config({ path: '../.env' });

async function deleteObject(input) {
    try {
        // Initialize the S3 client
        const s3Client = new S3Client({
            region: "us-east-1",
            credentials: {
                accessKeyId: input.accessKey,
                secretAccessKey: input.secretKey,
            },
        });

        // Ensure the key is properly encoded (and replace %2F back to slashes)
        const encodedKey = encodeURIComponent(input.fileKey).replace(/%2F/g, '/');
        
        // Check if the object exists before attempting deletion
        const headCommand = new HeadObjectCommand({
            Bucket: input.bucketName,
            Key: encodedKey,
        });

        try {
            const headResponse = await s3Client.send(headCommand);
            console.log('Object exists:', headResponse);
        } catch (err) {
            console.error('Object does not exist or cannot be found:', err);
            return { hasErrors: true, error: err };
        }

        // Proceed to delete the object
        const deleteCommand = new DeleteObjectCommand({
            Bucket: input.bucketName,
            Key: encodedKey,
        });

        const awsResponse = await s3Client.send(deleteCommand);

        // Log the delete operation result
        console.log('DeleteObjectCommand response: ', awsResponse);
        
        return { hasErrors: false, result: awsResponse };
    } catch (err) {
        console.error('Error in deleteObject: ', err);
        return { hasErrors: true, error: err };
    }
}


let input = {
    accessKey: process.env.AWS_ACCESS_KEY_ID ,            
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: "backflipt-sftp-bucket-us-east",
  fileKey: "hemanth/Holiday List Renamed - 2023.docx"
}
deleteObject(input)