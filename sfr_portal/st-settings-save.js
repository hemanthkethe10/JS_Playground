module.exports = function (input) {
    const testAccounts = input.universalAccounts
      .split(",")
      .map((account) => account.trim());
    const prodAccounts = input.prodAccounts
      ? input.prodAccounts.split(",").map((account) => account.trim())
      : [];
    if (input?.production?.universalAccounts) {
      input.production.universalAccounts = prodAccounts;
    }
  
    const prodsettings = input?.production && {
      "production.uid": input.production.uid,
      "production.gid": input.production.gid,
      "production.homePath": input.production.homePath,
      "production.universalAccounts": prodAccounts,
      "production.routeTemplateName": input.production.routeTemplateName,
      "production.routeFailureTemplate": input.production.routeFailureTemplate,
      "production.routeSuccessTemplate": input.production.routeSuccessTemplate,
    };
    return {
      testAccounts: testAccounts,
      prodAccounts: prodAccounts,
      test: {
        accounts: testAccounts,
        instance: input.testInstanceName,
        errorKey: "stSettings.universalAccounts",
      },
      prod: {
        accounts: prodAccounts,
        instance: input.prodInstanceName,
        errorKey: "stSettings.production.universalAccounts",
      },
      editedProductionData: prodsettings,
    };
  };