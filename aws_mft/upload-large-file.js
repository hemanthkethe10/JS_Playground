const AWS = require("aws-sdk");
const fs = require("fs");
require('dotenv').config({ path: '../.env' });

// AWS S3 Configuration
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,            
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
});

// File and S3 details
const bucketName = "backflipt-sftp-bucket-us-east";
const key = "large-1gb-file.dat";

// Multipart Upload Configuration
const CHUNK_SIZE = 100 * 1024 * 1024; //Minimum chunk size of 5MB
const TOTAL_SIZE = 1024 * 1024 * 1024; 

async function uploadLargeFile() {
  try {
    console.log("🚀 Starting Multipart Upload...");

    // Step 1: Create Multipart Upload
    const multipart = await s3
      .createMultipartUpload({ Bucket: bucketName, Key: key })
      .promise();
    const uploadId = multipart.UploadId;
    console.log(`✅ Upload ID: ${uploadId}`);

    // Step 2: Upload Parts
    let partNum = 1;
    let partsArray = [];
    let uploadedSize = 0;

    const fileStream = fs.createReadStream("/dev/zero", { highWaterMark: CHUNK_SIZE });

    for await (const chunk of fileStream) {
      if (uploadedSize >= TOTAL_SIZE) break; // Stop after 5TB

      console.log(`📤 Uploading part ${partNum}...`);

      const uploadPart = await s3
        .uploadPart({
          Bucket: bucketName,
          Key: key,
          PartNumber: partNum,
          UploadId: uploadId,
          Body: chunk,
        })

      partsArray.push({ PartNumber: partNum, ETag: uploadPart.ETag });
      uploadedSize += chunk.length;
      console.log(`✅ Uploaded part ${partNum} (${(uploadedSize / TOTAL_SIZE * 100).toFixed(2)}%)`);
      
      partNum++;
    }

    // Step 3: Complete Multipart Upload
    await s3
      .completeMultipartUpload({
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: partsArray },
      })
      .promise();

    console.log("🎉 Upload Completed Successfully!");
  } catch (error) {
    console.error("❌ Upload Failed:", error);
  }
}

// Start Upload
let startTime = new Date().getTime();
console.log("start time:", new Date());
uploadLargeFile();
let endTime = new Date().getTime();
console.log("end time:", new Date());
console.log("Total time taken for upload:", endTime - startTime, "ms");
