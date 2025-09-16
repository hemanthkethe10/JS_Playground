module.exports = (input) =>{
  let info = input.info;
  let fileIDPayload ={};
  if(info.existingFileID.enabled === "false"){
    fileIDPayload.environment = info.instanceType;
    fileIDPayload.partnerId = info.partner;
    fileIDPayload.account = info.direction === "Inbound" ? info.account : info.partnerAccount;
    fileIDPayload.clientName = info.existingFileID.clientName;
    (info.existingFileID.type === "other") ? fileIDPayload.idValue = info.existingFileID.idValue :"";
    (info.existingFileID.newClient && input.type === "new") ? fileIDPayload.newClient = info.existingFileID.newClient : "";
    (input.type === "edit") ? fileIDPayload.fileId = input.fileId :"";
    fileIDPayload.type = info.existingFileID.type;
    fileIDPayload.division = info.existingFileID.division;
    fileIDPayload.dataSensitivity = info.existingFileID.dataSensitivity;
    fileIDPayload.fileDetails = info.currentRoutes.map((route,index) => {
       let fileIndex = index+1;
     return {
         "fileDetailIndex":`FD0000${fileIndex}`,
         "classifier":route.classifier,
         "fileDescription": route.fileDescription,
         "fileNamePattern": route.fileNamingPattern,
         "fileNameExample": route.fileNamingExample
        }
    });
    fileIDPayload.fdIndex = info.currentRoutes.length;
  }
  return fileIDPayload;
 }