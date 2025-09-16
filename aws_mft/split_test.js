function encodeFilePath(input) {
    if(input.path){
    const parts = input.path.split('/');
    const fileName = parts.pop();
    const encodedFileName = encodeURIComponent(fileName); 
    return {"path":`${parts.join('/')}/${encodedFileName}`,"fileName":encodedFileName};
  }
}

module.exports = encodeFilePath;