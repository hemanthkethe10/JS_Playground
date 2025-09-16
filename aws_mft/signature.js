var crypto = require('crypto-js');
var crypto1 = require('crypto');
require('dotenv').config({ path: '../.env' });


const run = (input) => {
  var access_key = input.accessKey;
  var secret_key = input.secretKey;
  var region = input.region;
  var url = input.host;
  var myService = input.service;
  var myMethod = input.method;
  var myPath = input.path;
  var qs = input.qs
  if(qs == ''){

  }
  else{
    qs = qs+'&'
  }


  // get the various date formats needed to form our request
  var date  = new Date().toISOString()
  var amzDate = getAmzDate(date);
  var authDate = amzDate.split("T")[0];
  console.log("authDate: ",authDate,"amzDate: ",amzDate)
  var scope =  authDate +'%2F'+region+'%2F'+myService+'%2F'+'aws4_request'
  var credentials = access_key+'%2F'+scope

  var paramstring = qs + 'X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential='+credentials+'&X-Amz-Date='+getAmzDate(date)+'&X-Amz-Expires='+86400+'&X-Amz-SignedHeaders=host'
  var hashPayload = ''
  if(myService.toLowerCase() === "s3"){
    hashPayload = 'UNSIGNED-PAYLOAD'

  } else{
    hashPayload = crypto1.createHash('sha256').update('').digest('hex')
    
  }
  var canonicalReq = myMethod + '\n' +myPath + '\n' +paramstring+'\n' +'host:' + url + '\n' +'\n'+'host' +'\n'+hashPayload;
  var canonicalReqHash = crypto.SHA256(canonicalReq).toString();

  // form our String-to-Sign
  var stringToSign = 'AWS4-HMAC-SHA256\n' +amzDate + '\n' +authDate+'/'+region+'/'+myService+'/aws4_request\n'+canonicalReqHash;

  // get our Signing Key
  var signingKey = getSignatureKey(crypto, secret_key, authDate, region, myService);

  // Sign our String-to-Sign with our Signing Key
  var authKey = crypto.HmacSHA256(stringToSign, signingKey);

  // Form our authorization header
  

  // returns our headers together
  var port = 'https://'
  data = {
    'url':port + url+ myPath+'?'+paramstring+'&X-Amz-Signature='+authKey
  };
  
return data;

// this function gets the Signature Key, see AWS documentation for more details, this was taken from the AWS samples site
function getSignatureKey(Crypto, key, dateStamp, regionName, serviceName) {
    var kDate = Crypto.HmacSHA256(dateStamp, "AWS4" + key);
    var kRegion = Crypto.HmacSHA256(regionName, kDate);
    var kService = Crypto.HmacSHA256(serviceName, kRegion);
    var kSigning = Crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}

// this function converts the generic JS ISO8601 date format to the specific format the AWS API wants
function getAmzDate(dateStr) {
  var chars = [":","-"];
  for (var i=0;i<chars.length;i++) {
    while (dateStr.indexOf(chars[i]) != -1) {
      dateStr = dateStr.replace(chars[i],"");
    }
  }
  dateStr = dateStr.split(".")[0] + "Z";
  return dateStr;
}
};

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
console.log(run(input))