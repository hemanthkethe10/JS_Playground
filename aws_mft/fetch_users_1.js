function(input) {
  if (input.pageData.updatedUsers.result.length < parseInt(input.limit)) {
    input.pageData.showMore = false;
  }
  else {
    input.pageData.showMore = !(input.pageData.offset + input.pageData.limit === input.pageData.dataCount);
  }
  input.pageData.isEmpty = false;
  input.pageData.updatedUsers.result.forEach(
    (user) => {
       user.isOwner = user.isSuperAdmin || user.email === input.context.principal.userName;
      user.format = (user.lastLoginAt) ? "DATE" : "";
      user.lastLoginAt = user.lastLoginAt || "NA";
      user.showSTAccount = (user.accountInfo?.hasErrors!==false && user.role === "Business User");
      if(user.role === "Business User" && input.pageData.prodStatus?.prodEnabled && user.accountInfo?.accountOption!=="none")
        user.showSTAccount = (user.accountInfo?.hasErrorsProd!==false);
            user.isEdit = user.isSuperAdmin === true;
            user.role = user.isSuperAdmin ? "Super Admin" : user.role
    })
    input.pageData.currentUsers = input.pageData.currentUsers.concat(input.pageData.updatedUsers.result);

    input.pageData.count = input.pageData.updatedUsers.count;
  return true;
}