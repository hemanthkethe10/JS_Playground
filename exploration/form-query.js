let input = {
    "newFolderPath":"basis_health/ArgonAITest/Documents/Folder Three/",
    "currentFolderPath":"basis_health/ArgonAITest/Documents/Folder One/Folder Three/certificates/certificatepublickey.pem"
}
// module.exports = 
function run (input) {
  //newFolderPath, currentFolderPath
  let movedFolder = input.newFolderPath.split('/')
  let extractedFolder = movedFolder[movedFolder.length - 2];
  let currentFolder = input.currentFolderPath.split(extractedFolder)
  return currentFolder[1]
}
module.exports = run;
console.log(run(input))