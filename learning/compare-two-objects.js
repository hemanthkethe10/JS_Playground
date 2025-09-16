module.exports = function (input) {
  try {
    const filteredList = input.list?.filter(item => item.accountName === input.desiredValue);

    if (filteredList?.length > 0) { 
      const firstItem = filteredList[0]; 
      if (firstItem?.status === "Created") {
        return { "claim": true };
      } else if (firstItem?.status === "Submitted") {
        return {
          "finishOnboarding": true,
          "requestId": firstItem.requestId
        };
      }
    }
  } catch (e) {
    return "ERROR: " + e;
  }
};
