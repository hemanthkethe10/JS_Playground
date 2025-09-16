function encodeFilePath(input) {
    if(input.path){
    const parts = input.path.split('/');
    const fileName = parts.pop();
    const encodedFileName =  customUrlEncode(fileName);
    return {"path":`${parts.map((i)=>customUrlEncode(i)).join('/')}/${encodedFileName}`,"fileName":encodedFileName};
  }
}

function customUrlEncode(str) {
  let encoded = encodeURIComponent(str);
  encoded = encoded
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '%20')  
    .replace(/~/g, '%7E') // Add any other manual replacements here if needed
    ;

  return encoded;
}

module.exports = encodeFilePath;

let input = {"path":"/PlatformQA/Shared Documents/SharePoint to AWS S3 Sync/QA-SharePoint 4/QA-SharePoint SubFolder 4/sample_64(1).png"}
console.log(encodeFilePath(input))