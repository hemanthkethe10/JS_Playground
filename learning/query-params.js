 let queryParams=[]

// transferType
// businessUnit
// name

// if(input.transferType){
//     queryParams.push({"key":"transferType","value":input.transferType})
// }

let sMap={"k1":"v1","name":"v2","businessUnit":"aa"}
let requiredFields =["transferType","businessUnit","name"]

for (const [a,b] of Object.entries(sMap)){
    if(requiredFields.includes(a) && b){
        queryParams.push({'key':a,"value":b})
    }
    console.log("key",a,"value",b)
}
console.log(queryParams)