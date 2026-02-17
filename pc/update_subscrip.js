module.exports = (input) => {
  function filterNullValues(obj) {
  return Object.keys(obj).reduce((result, key) => {
    if (obj[key] !== null) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}
let routeObj = filterNullValues(input.data);
let finalObj = {};
(routeObj)&&(Object.keys(routeObj).length)>0?Object.keys(routeObj).map(key => {
  if(key.includes('userVars.')){
    finalObj[key]=routeObj[key]
  }
  else{
  finalObj["userVars."+key]=routeObj[key]
}
}):"";
if (input.transferConfigurations.length > 0) {
  input.transferConfigurations[0].site = input.source.siteName;
  input.transferConfigurations[0].outbound = true;
} else {
  input.transferConfigurations = [{
    site: input.source.siteName,
    outbound: true
  }];
}

let schedules = [
			{
				"tag": "PARTNER-IN",
				"type": "EXPRESSION",
				"cronExpression": input.source.cron,
				"startDate": input.startDate
			}
		]
let schedule = [{
			"type": "HOURLY",
			"startDate": input.startDate,
			"skipHolidays": false,
			"tag": "PARTNER-IN",
			"hourlyStep": input.source.schedule,
			"hourlyType": "PERMINUTES"
		}]
if (input.source.schedule === "cron"){
 return {"attr":finalObj,"config":input.transferConfigurations,"schedule":schedules}
}
else {
 return {"attr":finalObj,"config":input.transferConfigurations,"schedule":schedule}
}
}