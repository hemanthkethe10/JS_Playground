var crypto = require('crypto-js');
var crypto1 = require('crypto');
const axios = require("axios")
require('dotenv').config({ path: '../.env' });


function getSignatureKey(Crypto, key, dateStamp, regionName, serviceName) {
    const kDate = Crypto.HmacSHA256(dateStamp, "AWS4" + key);
    const kRegion = Crypto.HmacSHA256(regionName, kDate);
    const kService = Crypto.HmacSHA256(serviceName, kRegion);
    const kSigning = Crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
  }
  
  // Helper function to format the AWS Date
  function getAmzDate(dateStr) {
    let result = dateStr.replace(/[-:]/g, "");
    result = result.split(".")[0] + "Z";
    return result;
  }
  
  const signaturev1 = (input) => {
    const accessKey = input.accessKey;
    const secretKey = input.secretKey;
    const region = input.region;
    const host = input.host;
    const service = input.service;
    const method = (input.method || "POST").toUpperCase();
    const path = input.path || "/";
    const qs = input.qs || "";
    const requestBody = input.body || "";
  
    // Get the various date formats needed to form our request
    const now = new Date().toISOString();
    const amzDate = getAmzDate(now);
    const dateStamp = amzDate.substring(0, 8);
  
    const headers = {};
    headers["host"] = host;
    headers["x-amz-date"] = amzDate;
  
    // Handling S3-specific headers
    if (service.toLowerCase() === "s3") {
      headers["x-amz-content-sha256"] = "UNSIGNED-PAYLOAD";
    } else {
      headers["content-type"] = input.contentType || "application/json";
    }
  
    // Prepare the payload hash
    const payloadHash = (service.toLowerCase() === "s3") ? "UNSIGNED-PAYLOAD" : crypto1.createHash('sha256').update(requestBody).digest('hex');
  
    // Sort and build canonical headers
    const sortedHeaderKeys = Object.keys(headers).map(k => k.toLowerCase()).sort();
    let canonicalHeaders = "";
    for (const key of sortedHeaderKeys) {
      const lowerKey = key.toLowerCase();
      const value = headers[key];
      canonicalHeaders += lowerKey + ":" + value.trim() + "\n";
    }
  
    const signedHeaders = sortedHeaderKeys.join(";");
    
    // Sort and encode query string
    const canonicalQueryString = qs ? Object.keys(qs).sort().map(key => `${encodeURIComponent(key)}=${encodeURIComponent(qs[key])}`).join('&') : "";
  
    // Construct the canonical request
    const canonicalRequest = `${method}\n${path}\n${canonicalQueryString}\n${canonicalHeaders}\n\n${signedHeaders}\n${payloadHash}`;
    const canonicalRequestHash = crypto.SHA256(canonicalRequest).toString();
  
    // Create the string to sign
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`;
  
    // Get the signing key
    const signingKey = getSignatureKey(crypto, secretKey, dateStamp, region, service);
  
    // Sign the string to get the signature
    const signature = crypto.HmacSHA256(stringToSign, signingKey).toString();
  
    // Construct the authorization header
    const authHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  
    headers["Authorization"] = authHeader;
  
    // Construct the final URL with the query string and signature
    const url = `https://${host}${path}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
    
    // Return the necessary components
    return {
      url,
      method,
      headers,
      body: requestBody
    };
  };

// Example usage
const input = {
  accessKey: process.env.AWS_ACCESS_KEY_ID ,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION ,
  host: "s3.amazonaws.com",
  service: "s3",          
  method: "GET",
  path: "/",
  qs: "Action=ListBuckets&Version=2010-05-08",
  body: ""
};

async function getResponse(){
const { url, method, headers, body } = signaturev1(input);
console.log("url", url);
  try {
  const response = await axios({
    method: method,
    url: url,
    headers: headers,
    data: body
  });
  console.log("ListServers success:\n", response.data);
} catch (err) {
  console.error("ListServers error:\n", err.response?.data || err.message);
}

}
console.log(getResponse())

