import 
{ S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } 
from "@aws-sdk/client-s3";
import fs from "fs";

// AWS S3 Configuration
const s3 = new S3Client({
  region: "us-east-1"
});

// File and S3 details
const bucketName = "backflipt-sftp-bucket-us-east";
const key = "testingLargeFiles/large-1gb-file.dat";

// Multipart Upload Configuration
const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB per part
const TOTAL_SIZE = 1 * 1024 * 1024 * 1024; // 5TB

async function uploadLargeFile() {
  try {
    console.log("Starting Multipart Upload...");

    // Step 1: Create Multipart Upload
    const multipartCommand = new CreateMultipartUploadCommand({ Bucket: bucketName, Key: key });
    const multipart = await s3.send(multipartCommand);
    const uploadId = multipart.UploadId;
    console.log(`Upload ID: ${uploadId}`);

    // Step 2: Upload Parts
    let partNum = 1;
    let partsArray = [];
    let uploadedSize = 0;

    const fileStream = fs.createReadStream("/dev/zero", { highWaterMark: CHUNK_SIZE });

    for await (const chunk of fileStream) {
      if (uploadedSize >= TOTAL_SIZE) break; 

      console.log(` Uploading part ${partNum}...`);

      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucketName,
        Key: key,
        PartNumber: partNum,
        UploadId: uploadId,
        Body: chunk,
      });

      const uploadPart = await s3.send(uploadPartCommand);

      partsArray.push({ PartNumber: partNum, ETag: uploadPart.ETag });
      uploadedSize += chunk.length;
      console.log(`Uploaded part ${partNum} (${((uploadedSize / TOTAL_SIZE) * 100).toFixed(2)}%)`);
      
      partNum++;
    }
    console.log("All parts uploaded successfully!",partsArray);
    // Step 3: Complete Multipart Upload
    const completeMultipartCommand = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: partsArray },
    });

    await s3.send(completeMultipartCommand);
    console.log("Upload Completed Successfully!");
  } catch (error) {
    console.error(" Upload Failed:", error);
  }
}

let startTime = new Date().getTime();
console.log("start time:", startTime);
let uploadResult = await uploadLargeFile();
console.log("result:", uploadResult);
let endTime = new Date().getTime();
console.log("end time:", endTime);
console.log("Total time taken for upload:", endTime - startTime, "ms");





