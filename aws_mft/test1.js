module.exports = function(input){
  try{
  //buAccountFolders , eftsAccountFolders
  let eftsAccountHomeFolder = input.eftsAccountHomeFolder;
  let buAccountHomeFolder = input.buAccountHomeFolder;
  return {
  "role":{
  "roleName":input.roleName,
  "roleARN":input.roleARN
  },
  "policy":{
  "policyName":input.policyName,
  "policyARN":input.policyARN
  },
  "eftsAccountFolder":{
  "folder":eftsAccountHomeFolder,
  "inboundFolder":eftsAccountHomeFolder + input.eftsAccountFolders[0],
  "outboundFolder":eftsAccountHomeFolder + input.eftsAccountFolders[1],
  "quarantineFolder":eftsAccountHomeFolder + input.eftsAccountFolders[2],
  },
  "buAccountFolder":{
  "folder":buAccountHomeFolder,
  "inboundFolder":buAccountHomeFolder + input.buAccountFolders[0],
  "outboundFolder":buAccountHomeFolder + input.buAccountFolders[1],
  "historyFolder":input.buAccountHomeFolder + input.buAccountFolders[2],
  }
  }}catch(e){
    return {
      error: e
    };
  }
}