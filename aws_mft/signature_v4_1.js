const cryptoJs = require("crypto-js");

function generate_aws_signaturev4(input) {
    const accessKey = input.accessKey;
    const secretKey = input.secretKey;
    const region = input.region;
    const host = input.host;
    const service = input.service;
    const method = (input.method || "GET").toUpperCase();
    const path = input.path || "/";
    const requestBody = input.body || "";
    const now = new Date().toISOString();
    const amzDate = toAmzDate(now);
    const dateStamp = amzDate.substring(0, 8); 
    const expires = input.expires || 900; 
    
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const credential = `${accessKey}/${credentialScope}`;
    
    const signedHeaders = ["host"];
    const additionalHeaders = input.headers || {};  // Accept additional headers
    
    // Add additional headers to the signed headers and canonical headers
    Object.keys(additionalHeaders).forEach(header => {
        signedHeaders.push(header.toLowerCase());  
    });

    // Sort and build canonical headers
    const canonicalHeaders = `host:${host}\n` + 
        Object.keys(additionalHeaders).map(header => `${header.toLowerCase()}:${additionalHeaders[header]}`).join("\n") + "\n";

    // Process additional query parameters
    const additionalQueryParams = {};
    if (input.qs) {
        input.qs.split("&").forEach(kv => {
            const [key, value] = kv.split("=");
            additionalQueryParams[key] = value;
        });
    }
    
    const queryParams = {
        ...additionalQueryParams,
        "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
        "X-Amz-Credential": encodeURIComponent(credential),
        "X-Amz-Date": amzDate,
        "X-Amz-Expires": expires,
        "X-Amz-SignedHeaders": signedHeaders.join(";")  // Join signed headers with semicolon
    };
  
    // Build canonical query string
    const canonicalQueryString = Object.keys(queryParams)
      .sort()
      .map(key => `${key}=${queryParams[key]}`)
      .join("&");
  
    const payloadHash = service.toLowerCase() === "s3" ? "UNSIGNED-PAYLOAD" : sha256(requestBody);
  
    const canonicalRequest =
      `${method}\n` +
      `${path}\n` +
      `${canonicalQueryString}\n` +
      `${canonicalHeaders}\n` +
      `${signedHeaders.join(";")}\n` +  // List all signed headers
      `${payloadHash}`;
  
    const canonicalRequestHash = cryptoJs.SHA256(canonicalRequest).toString();
    const stringToSign = 
      "AWS4-HMAC-SHA256\n" +
      `${amzDate}\n` +
      `${credentialScope}\n` +
      `${canonicalRequestHash}`;
  
    const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
    const signature = cryptoJs.HmacSHA256(stringToSign, signingKey).toString();
  
    const fullQueryString = `${canonicalQueryString}&X-Amz-Signature=${signature}`;
    const url = `https://${host}${path}?${fullQueryString}`;
  
    return {
      url,
      method
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

// module.exports = generate_aws_signaturev4;
let input = {
  "accessKey": "<AWS_ACCESS_KEY_ID>",
  "secret": "<AWS_SECRET_ACCESS_KEY>",
  "region": "<AWS_REGION>",
  "method": "PUT",
  "service": "s3",
  "pathPrefix": "/my-second-image.jpg",
  "host": "<AWS_HOST>",
  "body": "",
  "expires": "",
  "queryParams_multiValue": null
}
let result = generate_aws_signaturev4(input);
console.log(result);