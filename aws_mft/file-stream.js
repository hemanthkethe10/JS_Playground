import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import https from "https";

// Initialize S3 Client
const s3 = new S3Client({
    region: "us-east-1", // Change to your region
    forcePathStyle: true, // Ensure compatibility
});

export const handler = async (event) => {
    try {
        const fileUrl = event.fileUrl;
        if (!fileUrl || !fileUrl.startsWith("http")) {
            throw new Error("Invalid or missing fileUrl");
        }

        console.log("Fetching file from:", fileUrl);

        const stream = await fetchFileStream(fileUrl);

        const bucketName = "largefilesforlamda";
        const fileName = `uploaded-file-${Date.now()}.bin`;

        // Use Upload to handle streaming unknown length
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: bucketName,
                Key: fileName,
                Body: stream,
            },
        });

        const uploadResult = await upload.done();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "File uploaded successfully",
                fileUrl: uploadResult.Location,
            }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

// Function to fetch file as a stream
const fetchFileStream = (fileUrl) => {
    return new Promise((resolve, reject) => {
        https.get(fileUrl, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to fetch file: ${response.statusCode}`));
                return;
            }
            resolve(response);
        }).on("error", reject);
    });
};
console.log("result:", uploadResult);