import {
    TransferClient,
    SendWorkflowStepStateCommand
  } from "@aws-sdk/client-transfer";
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand 
} from "@aws-sdk/client-s3"
  
  export const handler = async (event,context) => {
    console.log("Full event:", JSON.stringify(event));
    console.log("Full context:", JSON.stringify(context));
    const workflowId = event?.serviceMetadata?.executionDetails?.workflowId;
    const executionId = event?.serviceMetadata?.executionDetails?.executionId;
    const userName = event?.serviceMetadata?.transferDetails?.userName;
    const bucketName = event?.fileLocation?.bucket;
    const objectKey = event?.fileLocation?.key;
    const token = event?.token;
    const transferClient = new TransferClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1"
    });
    const params = {
      WorkflowId: workflowId,
      ExecutionId: executionId,
      Status: "SUCCESS",
      Token: token
    };
  
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const filePathKeys = objectKey.split("/")
      console.log("File Path Keys:", filePathKeys)
      const fileName = filePathKeys[filePathKeys.length - 1];
      const newFileName = `from_${userName}_${currentDate}_${fileName}`;
      const newObjectKeyPath = filePathKeys.slice(0, filePathKeys.length - 1).join("/") + "/" + newFileName;
      const copyObjectResponse = await s3Client.send(
        new CopyObjectCommand({
          Bucket: bucketName,
          Key: newObjectKeyPath,
          CopySource: `${bucketName}/${objectKey}`
        })
      )
      console.log("Copy object response:", copyObjectResponse);
      //Delete the original object
      const deleteObjectResponse = await s3Client.send(
              new DeleteObjectCommand({
                Bucket: bucketName,
                Key: objectKey
              })
            )
      console.log("Delete object response:", deleteObjectResponse);
      // const result = await transferClient.send(
      //   new SendWorkflowStepStateCommand(params)
      // )
      // console.log("sendWorkflowStepState result:", result);
    } catch (error) {
      console.error("Error calling sendWorkflowStepState:", error);
      throw error;
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Custom step completed successfully",
        workflowId,
        executionId
      }),
    };
  };
  