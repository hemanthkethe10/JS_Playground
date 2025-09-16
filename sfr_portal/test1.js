function encodeFilePath(input) {
    if(input.path){
    const parts = input.path.split('/');
    const fileName = parts.pop();
    const encodedFileName =   isURLEncoded(fileName) ? fileName : encodeURIComponent(fileName);
    return {"path":`${parts.join('/')}/${encodedFileName}`,"fileName":encodedFileName};
  }
}

function isURLEncoded(str) {
  if (typeof str !== 'string') return false;

  try {
    const decoded = decodeURIComponent(str);
    return encodeURIComponent(decoded) === str;
  } catch (e) {
    return false;
  }
}
console.log(encodeFilePath({path:"/FMDev/Shared%20Documents/Express%20Scripts%20Activities/Redis%20On%20CentOS%207.9.pdf"}));