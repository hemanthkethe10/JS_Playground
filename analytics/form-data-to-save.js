function saveData(input){
    //event,file
    console.log("current stored value",localStorage.getItem('currentDestination'))
    console.log("input",input)
    let coreId = input.file.CoreId;
    let details = {
        "accountName":input.event.AccountUsername,
        "remoteAddress":input.event.RemoteAddr,
        "sourceInfo":input.event.SourceInfo,
        "stDirectory":input.event.STDirectory,
        "cycleId":input.file.CycleId,
        "deliveryMethod":input.file.Protocol,
        "parentCycleId":input.file.ParentCycleId || "NA"
    }
    let dataToBeSaved = {"coredId":coreId,"details":details}
    localStorage.setItem('currentDestination',JSON.stringify(dataToBeSaved))
    console.log("Data saved")
}