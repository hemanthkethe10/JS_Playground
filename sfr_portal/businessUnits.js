// function (input) {
//     //type, instance
//     let persistence = localStorage.getItem('statePersistence') || {};
//     let infoMap = {"instance": input.instance,}
//     persistence[input.type] = infoMap
//     localStorage.setItem('statePersistence', JSON.stringify(persistence))
//     console.log("State saved successfully");
// }
// function saveState(input) {
//     let persistence = JSON.parse(localStorage.getItem('statePersistence')) || {};
//     let infoMap = {
//         "instance": input.instance,
//         "lastUpdated": new Date().getTime() 
//     };
//     persistence[input.type] = infoMap;
//     localStorage.setItem('statePersistence', JSON.stringify(persistence));
//     console.log("State saved successfully");
// }


// function(input) {
//     //type, keyToSet, keyToFetch
//     let persistence = localStorage.getItem('statePersistence');
//     let persistenceJson = persistence ? JSON.parse(persistence) : {};
//     let instance = persistenceJson[input.type] || "";
//     instance ? input.pageData[input.keyToSet] = instance[input.keyToFetch] : ""
//    console.log("pageData",input.pageData)
//     return true;
// }


// function(input) {
//     try {
//     input.pageData.ascendingImage={};
//     input.pageData.descendingImage={};
//     input.pageData.sortingImage = {};
//     input.pageData.searchResults = false;
//     input.pageData.limit = parseInt(input.context.app.config.limit);
//     input.pageData.offset = parseInt(input.context.app.config.offset);
//     input.pageData.field = "lastActivityTime";
//     input.pageData.order = -1;
//     input.pageData.defaultDropdown = input.context.app.config.testInstanceName
//     return true;
//     }
//     catch (error) {
//       console.log("ERROR: ", error);
//     }
//   }




// function HideProdTabs (input) {
// //isProdEnabled
// if (!input.isProdEnabled){
//     $(document).ready(() => {
//     let prodTabsToHide = document.getElementsByName('prod-tab')
//     console.log("Hiding prod tabs",prodTabsToHide);
//     for (let i = 0; i < prodTabsToHide.length; i++) {
//       prodTabsToHide[i].style.display = 'none'
//     }
//     })
//    }
// }

// function getInstance(input) {
//     //type, keyToSet, keyToFetch, isProdEnabled, context
//     let persistence = localStorage.getItem('statePersistence');
//     let persistenceJson = persistence ? JSON.parse(persistence) : {};
//     let instance =  (input.isProdEnabled && persistenceJson[input.type]) ? persistenceJson[input.type] : input.context.app.config.testInstanceName;
//     console.log("instance",instance)
//     input.pageData[input.keyToSet] = (typeof(instance) === 'object' && input.isProdEnabled) ? instance[input.keyToFetch] : instance
//     return true;
// }

// function buInitializations(input) {
//   try {
// input.pageData.ascendingImage={};
// input.pageData.descendingImage={};
//       input.pageData.offset = parseInt(input.context.app.config.offset);
//       input.pageData.limit = parseInt(input.context.app.config.limit);
//       input.pageData.searchResults=false;
//       input.pageData.field = "lastActivityTime";
//       input.pageData.order = -1;
//       let filters = JSON.parse(
//         input.context.app.config.itRoutingFilters
//       );
//       input.pageData.itFilters = (input.isProdEnabled) ? filters : filters.filter((f)=> !f.label.includes('Prod'));
//     return true;
//   }
//   catch (error) {
//     console.log("ERROR: ", error);
//   }
// }

// function (input) {
//   try {
// input.pageData.ascendingImage={};
// input.pageData.descendingImage={};
// input.pageData.field = "lastActivityTime";
// input.pageData.order = -1;
// input.pageData.offset = parseInt(input.context.app.config.offset);
// input.pageData.limit = parseInt(input.context.app.config.limit);
// if(input.requests==="requestIdSortAsc"){
//  input.pageData.limit = input.limit;
// }
// let filters = JSON.parse(
//   input.context.app.config.itRoutingFilters
// );
// input.pageData.itFilters = (input.isProdEnabled) ? filters : filters.filter((f)=> !f.label.includes('Prod'));

//       input.pageData.searchResults=false;
//     return true;
//   }
//   catch (error) {
//     console.log("ERROR: ", error);
//   }
// }

function testExistense(input) {
  let routeType = ''
  console.log("routeType",input.routeType);
  switch (input.routeType) {
    case 'Inbound':
     routeType = input.defaultPackages.inbound;
     break;
    case 'Outbound':
      routeType =  input.defaultPackages.outbound;
     break;
    default:
     routeType =  input.defaultPackages.unzip;
  }
  let filteredPackages = input.packages.filter((it)=> it.name != routeType);
  console.log("filteredPackages",filteredPackages);
  let flattenSubscriptions = filteredPackages.flatMap((t)=>t.subscriptions);
  console.log("flattenSubscriptions",flattenSubscriptions);
  let isAssociated = (input.subscriptionId && flattenSubscriptions.find((t)=> t === input.subscriptionId))? true : false;
  return {"isAssociated": isAssociated};
};

let input= {
	"packages": [
		{
			"id": "2c9f8ebf91dae624019223bf110053f0",
			"name": "OutboundRoutePackage",
			"description": "",
			"type": "COMPOSITE",
			"managedByCG": null,
			"routeTemplate": "2c9f8ebf8fecfb820190fd30514f07a7",
			"account": "BU_DataTransfer",
			"condition": "true",
			"conditionType": "MATCH_ALL",
			"failureEmailNotification": false,
			"failureEmailTemplate": null,
			"failureEmailName": "",
			"successEmailNotification": false,
			"successEmailTemplate": null,
			"successEmailName": "",
			"triggeringEmailNotification": false,
			"triggeringEmailName": "",
			"triggeringEmailTemplate": null,
			"steps": [],
			"stepStatuses": [],
			"businessUnits": [],
			"subscriptions": [
				"2c9f8ebf91dae624019223be84e653eb"
			],
			"additionalAttributes": {},
			"metadata": {
				"links": {
					"self": "https://axway-st-3.xeninc.us:8444/api/v2.0/routes/2c9f8ebf91dae624019223bf110053f0",
					"routeTemplate": "https://axway-st-3.xeninc.us:8444/api/v2.0/routes/2c9f8ebf8fecfb820190fd30514f07a7",
					"account": "https://axway-st-3.xeninc.us:8444/api/v2.0/accounts/BU_DataTransfer",
					"subscriptions": "https://axway-st-3.xeninc.us:8444/api/v2.0/subscriptions?route=2c9f8ebf91dae624019223bf110053f0"
				}
			}
		}
	],
	"subscriptionId": "2c9f8ebf91dae624019223be84e653eb",
	"defaultPackages": {
		"inbound": "InboundRoutePackage",
		"outbound": "OutboundRoutePackage",
		"unzip": "UnzipRoutePackage"
	},
	"routeType": "Inbound"
}
console.log(testExistense(input))