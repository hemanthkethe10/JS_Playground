module.exports = (input) => {
    if (input.route.requestType === "New"){
        let routes = input.route?.currentRoutes?.length || 0;
        console.log(typeof(input.route?.currentRoutes))
        return (routes != 0) && input.route?.currentRoutes.some((r)=>r.hasOwnProperty('destinations'))
        }
        else {
        return true;
        }
}


function run(input){
    if (input.route.requestType === "New"){
    let routes = input.route?.currentRoutes?.length || 0;
    console.log(typeof(input.route?.currentRoutes))
    return (routes != 0) && input.route?.currentRoutes.some((r)=>r.hasOwnProperty('destinations'))
    }
    else {
    return true;
    }
}

let m ={
	"route": {
		"instanceType": "Model",
		"direction": "Outbound",
		"partner": "PART00002",
		"partnerName": "Backflipt",
		"undefined": "Automation software",
		"externalOwner": {
			"name": "ext_1",
			"email": "ext_1@backflipt.com"
		},
		"source": {
			"name": "TransferAccount",
			"folderType": "newFolder",
			"folderName": "/work"
		},
		"account": "My_files_account",
		"requestType": "New",
        "currentRoutes":[{
            "des":[]
        }]
	}
}

console.log(run(m))