module.exports = (input) => {
    let routeIndex = input.fields.routeIndex;
    let destinationIndex = input.fields.destinationIndex;
    let routeObject = input.route;
    if(input.fields.source){
        let keys = Object.keys(input.fields.source)
        keys.map((k)=>{
            routeObject.source[k] = input.fields.source[k];
        })
    }
    
    if(input.fields.encodingConversions){
        routeObject.currentRoutes[routeIndex].encodingConversions.source = input.fields.encodingConversions.source;
        routeObject.currentRoutes[routeIndex].encodingConversions.output = input.fields.encodingConversions.output;
    }
    if (input.fields.renameFile){
        routeObject.currentRoutes[routeIndex].renameFile.renameExpression = input.fields.renameFile.renameExpression;
    }
    return routeObject;
    }