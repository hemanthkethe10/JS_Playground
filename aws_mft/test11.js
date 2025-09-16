module.exports = function(input) {
  try {
    let sftpuserCreationStatus =  input.provisioningStatusDetails.filter(item => 
      item.itemToProvision === input.sftpUserStatus
    );
    return sftpuserCreationStatus.length === 0 ? sftpuserCreationStatus[0]?.isSuccessfull : false;
  } catch (error) {
    return false;
  }
};
