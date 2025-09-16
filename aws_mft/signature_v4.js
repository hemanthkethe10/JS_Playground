const cryptoJs = require("crypto-js");
const crypto = require("crypto");  
const axios = require("axios")
require('dotenv').config({ path: '../.env' });


function run(input) {
  const accessKey = input.accessKey;
  const secretKey = input.secretKey;
  const region = input.region;
  const host = input.host;  
  const service = input.service;
  const method = (input.method || "POST").toUpperCase();
  const path = input.path || "/";
  const qs = input.qs || "";
  const requestBody = input.body || "";

  const now = new Date().toISOString();
  const amzDate = toAmzDate(now);
  var authDate = amzDate.split("T")[0];
  const dateStamp = amzDate.substring(0, 8);
  const headers = {};

  headers["host"] = host;

  headers["x-amz-date"] = amzDate;

  if (service.toLowerCase() === "s3") {
    headers["x-amz-content-sha256"] = "UNSIGNED-PAYLOAD";
  }
  if (service.toLowerCase() === "transfer") {
    headers["content-type"] = "application/x-amz-json-1.1";
    if (input.xAmzTarget) {
      headers["x-amz-target"] = input.xAmzTarget;
    }
  } else {
    headers["content-type"] = input.contentType || "application/json";
  }

  const payloadHash = crypto.createHash("sha256").update(requestBody).digest("hex");
  console.log("payloadHash", payloadHash,"requestBody", requestBody);
  const sortedHeaderKeys = Object.keys(headers).map(k => k.toLowerCase()).sort();

  let canonicalHeaders = "";
  for (const key of sortedHeaderKeys) {
    const lowerKey = key.toLowerCase();
    const value = headers[key];
    canonicalHeaders += lowerKey + ":" + value.trim() + "\n";
  }
  const signedHeaders = sortedHeaderKeys.join(";");
  var scope =  authDate +'%2F'+region+'%2F'+service+'%2F'+'aws4_request'
  var credentials = accessKey+'%2F'+scope
  const canonicalQueryString = qs+ 'X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential='+credentials+'&X-Amz-Date='+toAmzDate(now)+'&X-Amz-Expires='+86400+'&X-Amz-SignedHeaders=host'
  const canonicalRequest = 
    method + "\n" +
    path + "\n" +
    canonicalQueryString + "\n" +
    // canonicalHeaders + "\n" +
    signedHeaders + "\n" +
    payloadHash;

  console.log("canonicalRequest", canonicalRequest)
  const canonicalRequestHash = cryptoJs.SHA256(canonicalRequest).toString();

  //    "AWS4-HMAC-SHA256\n" + amzDate + "\n" + <credential scope> + "\n" + <hashed canon req>
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = dateStamp + "/" + region + "/" + service + "/aws4_request";
  const stringToSign =
    algorithm + "\n" +
    amzDate + "\n" +
    credentialScope + "\n" +
    canonicalRequestHash;
  const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
  const signature = cryptoJs.HmacSHA256(stringToSign, signingKey).toString();

  const authHeader =
    algorithm +
    " Credential=" + accessKey + "/" + credentialScope +
    ", SignedHeaders=" + signedHeaders +
    ", Signature=" + signature;

  headers["Authorization"] = authHeader;

  // headers["x-amz-security-token"] = input.sessionToken;

  const url = "https://" + host + path + (qs ? "?" + qs : "");

  return {
    url,
    method,
    headers,
    body: requestBody
  };
}
function getSignatureKey(secretKey, dateStamp, regionName, serviceName) {
  const kDate = cryptoJs.HmacSHA256(dateStamp, "AWS4" + secretKey);
  const kRegion = cryptoJs.HmacSHA256(regionName, kDate);
  const kService = cryptoJs.HmacSHA256(serviceName, kRegion);
  const kSigning = cryptoJs.HmacSHA256("aws4_request", kService);
  return kSigning;
}

function toAmzDate(dateStr) {
  let result = dateStr.replace(/[-:]/g, "");
  result = result.split(".")[0] + "Z";
  return result; 
}

async function listServers() {
    const input = {
        accessKey: process.env.AWS_ACCESS_KEY_ID ,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION ,
        host: "s3.amazonaws.com",
        service: "s3",          
        method: "GET",
        path: "/",
        qs:"Action=ListBuckets&Version=2010-05-08",
        body:""
        // body: JSON.stringify({ MaxResults: 1 }), 
        // xAmzTarget: "s3.ListBuckets"
      };
      
  
    const { url, method, headers, body } = run(input);
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

  console.log(listServers())