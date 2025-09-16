function run(input) {
  try {
    let limit = parseInt(input.limit);
    console.log(input.pageData);
    let length = input.profiles?.result?.length || 0;
    if (input.profiles.result === undefined || length === 0) {
      input.pageData.isEmpty = true;
      input.pageData.showMore = false;
    } else {
      let currentCount = input.pageData.offset + limit;
      input.pageData.isEmpty = false;
      input.pageData.currentProfiles = input.profiles.result;
      //input.pageData.showMore = currentCount <= input.pageData.currentProfiles.length;
      input.pageData.showMore = (currentCount<limit || currentCount %limit ===0)? false : true;
    }
    if (input.type === "sort") {
      return false;
    } else {
      input.pageData.dataCount = input.profiles.count;
    }

    console.log(input.pageData);
    return true;
  } catch (error) {
    console.log("Error:", error);
  }
}
