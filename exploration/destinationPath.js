function formDestinationPath(input) {
    try {
    let homeFolder = input.homeFolder?.split('/')?.at(1) || 'Documents';
    let item = input.item;
    let siteNameWithDrive = item.webUrl.split('/sites')?.at(1);
    let siteName = siteNameWithDrive?.split('/')?.at(1);
    const path = (!item.hasOwnProperty('deleted')) ? item.parentReference?.path?.split('root:')[1] : '';
    return {
        hasErrors: false,
        "destinationPath": siteName + '/' + homeFolder + path + '/' + item.name
    }
    }
    catch(error){
        return {
            hasErrors: true,
            error
        };
    }
}

module.exports = formDestinationPath;