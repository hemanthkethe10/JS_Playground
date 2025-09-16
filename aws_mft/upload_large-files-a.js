import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import pLimit from "p-limit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '../.env' });

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1", // Change to your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File and S3 details
const bucketName = "backflipt-sftp-bucket-us-east";
const key = "large-10gb-file.dat";

// Multipart Upload Configuration
const CHUNK_SIZE = 200 * 1024 * 1024;
const TOTAL_SIZE = 10 * 1024 * 1024 * 1024; 
const MAX_CONCURRENT_UPLOADS = 5; // Control parallel uploads

async function uploadLargeFile() {
  try {
    console.log("🚀 Starting Multipart Upload...");

    // Step 1: Create Multipart Upload
    const multipartCommand = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
    });
    const multipart = await s3.send(multipartCommand);
    const uploadId = multipart.UploadId;
    console.log(`✅ Upload ID: ${uploadId}`);

    // Step 2: Upload Parts in Parallel Without Keeping Data in Memory
    let partNum = 1;
    let partsArray = [];
    let uploadedSize = 0;

    const limit = pLimit(MAX_CONCURRENT_UPLOADS);
    const uploadTasks = [];

    // Stream data directly from /dev/zero to avoid memory issues
    const readStream = fs.createReadStream("/dev/zero", { highWaterMark: CHUNK_SIZE });

    for await (const chunk of readStream) {
      if (uploadedSize >= TOTAL_SIZE) break; // Stop after 5TB

      uploadTasks.push(
        limit(async () => {
          console.log(`📤 Uploading part ${partNum}...`);

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
          console.log(`✅ Uploaded part ${partNum} (${((uploadedSize / TOTAL_SIZE) * 100).toFixed(2)}%)`);

          partNum++;
        })
      );

      // Execute uploads without blocking memory
      if (uploadTasks.length >= MAX_CONCURRENT_UPLOADS) {
        await Promise.all(uploadTasks);
        uploadTasks.length = 0; // Clear completed tasks
      }
    }

    // Wait for any remaining uploads to finish
    await Promise.all(uploadTasks);

    // Step 3: Complete Multipart Upload
    const completeMultipartCommand = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: partsArray },
    });

    await s3.send(completeMultipartCommand);
    console.log("🎉 Upload Completed Successfully!");
  } catch (error) {
    console.error("❌ Upload Failed:", error);
  }
}

// Start Upload
let startTime = new Date().getTime();
console.log("start time:", startTime);
let r = await uploadLargeFile();
console.log("result:", r);
let endTime = new Date().getTime();
console.log("end time:", endTime);
console.log("Total time taken for upload:", endTime - startTime, "ms");
