import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand 
} from "@aws-sdk/client-s3"
  
  export const handler = async (event,context) => {
    console.log("Full event:", JSON.stringify(event));
    console.log("Full context:", JSON.stringify(context));
    const userName = event?.detail?.username;
    const filePath = event?.detail ? event.detail['file-path'] : "";
    const filePathKeys = filePath.split("/").filter(Boolean)
    const sourceBucketName = filePathKeys[0];
    const destinationBucketName = 'backflipt-sftp-bucket-us-east'
    const objectKeyToDelete = filePathKeys.slice(1).join("/");
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1"
    });
  
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      console.log("File Path Keys:", filePathKeys)
      const fileName = filePathKeys[filePathKeys.length - 1];
      const newFileName = `from_${userName}_${currentDate}_${fileName}`;
      const newObjectKeyPath = getUserHomePath(userName) + "/" + newFileName;
      const copyObjectResponse = await s3Client.send(
        new CopyObjectCommand({
          Bucket: destinationBucketName,
          Key: newObjectKeyPath,
          CopySource: filePath
        })
      )
      console.log("Copy object response:", copyObjectResponse);
      //Skipping the original object deletion for now
    //   const deleteObjectResponse = await s3Client.send(
    //           new DeleteObjectCommand({
    //             Bucket: sourceBucketName,
    //             Key: objectKeyToDelete
    //           })
    //         )
    //   console.log("Delete object response:", deleteObjectResponse);

    } catch (error) {
      console.error("Error in copy object function:", error);
      throw error;
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Custom lambda executed successfully"
      }),
    };
  };
  
  function getUserHomePath(userName) {
    //Folder is hard-coded for now
    return `EventBridge/${userName}`;
  }