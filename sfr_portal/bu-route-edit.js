module.exports = (input) => {
    let grpByDirection = input.grpByDirection;
    let routesData = input.routesData;  // Assuming routesData is provided in the input
    let modelRoutes = routesData.filter(route => route.instanceType === input?.config?.testInstanceName);
    let productionRoutes = routesData.filter(route => route.instanceType === input?.config?.prodInstanceName);
    let output = {};
    output["inboundRoutesCount"] = grpByDirection?.Inbound ? modelRoutes.filter((it)=> it.direction === 'Inbound').length : 0;
    output["outboundRoutesCount"] = grpByDirection?.Outbound ? modelRoutes.filter((it)=> it.direction === 'Outbound').length : 0;
    output["InternalRoutesCount"] = grpByDirection?.Internal ? modelRoutes.filter((it)=> it.direction === 'Internal').length : 0;
    //output.accountSpecificRoutes = routesData?.length ? routesData.length : 0;  
    output["templateRoutes"] = routesData.length ?? 0;  
    if(input?.prodEnabled === true){
        output["prodInboundRoutesCount"] = grpByDirection?.Inbound ? productionRoutes.filter((it)=> it.direction === 'Inbound').length : 0;
        output["prodOutboundRoutesCount"] = grpByDirection?.Outbound ? productionRoutes.filter((it)=> it.direction === 'Outbound').length: 0;
        output["prodInternalRoutesCount"] = grpByDirection?.Internal ? productionRoutes.filter((it)=> it.direction === 'Internal').length : 0;
        //output.accountSpecificRoutes = routesData?.length ? routesData.length : 0;  
        output["prodTemplateRoutes"] = routesData.length ?? 0;  
    }
    return output;
}