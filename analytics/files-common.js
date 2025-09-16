function commonFiles(input) {
    try {
        let limit = parseInt(input.limit);
     //   let length = input.pageData.count || 100;
        let length = input.pageData.currentCount || 100;
    if(input?.arrivedFilesCount?.RECORD_COUNT<= input.pageData.currentCount )
        length = parseInt(input.arrivedFilesCount.RECORD_COUNT);
        let offset = parseInt(input.offset);
        input.pageData.totalPageCount = Math.ceil(length / limit);
        input.pageData.currentPageCount = Math.floor(offset / limit)+1;
        if (input?.files === undefined ||input?.files?.length === 0 ) {
            input.pageData.isEmpty = true;
            input.pageData.showMore = false;
        } else {
            // if(input.files.length<limit && offset===0){
            //     input.pageData.totalPageCount = input.files.length
            // }
            input.pageData.isEmpty = false;
            input.pageData.arrivedFiles = input.files;
        }
        input.pageData.showPrevious = input.pageData.currentPageCount>1;
        input.pageData.showNext = input.pageData.totalPageCount>input.pageData.currentPageCount;
        input.pageData.paginateInstance = input.pageData.defaultInstance;
        input.pageData.hideLoad= true;
        //let defaultFilter = input.pageData.filters.find((f)=> f.isDefaultFilter === true);
        //input.pageData.filterMap = defaultFilter;
        console.log("pdc", input);
        return true;
    } catch (error) {
        console.log("ERROR: ", error);
    }
  }
  