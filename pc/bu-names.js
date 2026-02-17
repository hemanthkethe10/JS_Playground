const createBusinessUnitPath = (input) => {
    const buMapByName = new Map();

    input.buList.forEach(bu => {
        if (!buMapByName.has(bu.name)) {
            buMapByName.set(bu.name, []);
        }
        buMapByName.get(bu.name).push(bu);
    });

    // Function to find the parent by name
    const findParent = (parentName) => {
        const parentBUList = buMapByName.get(parentName);
        if (parentBUList) {
            // Here, we assume there's only one parent with the name, 
            // if multiple, choose based on some other criteria or handle ambiguities.
            return parentBUList[0];
        }
        return null;
    };

    // Iterate through the business units and append the 'businessUnitPath'
    return input.buList.map(bu => {
        let path = bu.name;  // Start with the current business unit's name
        let currentBU = bu;

        // Traverse up the parent chain by name
        while (currentBU.parent) {
            const parentBU = findParent(currentBU.parent); // Find the parent by name
            if (parentBU) {
                path = `${parentBU.name}/${path}`;  // Prepend parent name to path
                currentBU = parentBU;  // Move up the chain
            } else {
                break;  // Exit if there's no matching parent
            }
        }

        return {
            ...bu,  
            businessUnitPath: path,
            label : path,
            value : bu['name']
        };
    });
};

module.exports = createBusinessUnitPath;

// Sample input for testing
let input = {
    "buList":[
        {"businessUnitId":"BU00001","name":"pcBusinessUnit"},
        {"businessUnitId":"BU00002","name":"Stanley", "parent": "pcBusinessUnit"},
        {"businessUnitId":"LBU00007","name":"Business-A-Account1", "parent": "Stanley"},
        {"businessUnitId":"LBU00004","name":"BU_testSync", "parent": "Stanley"},
        {"businessUnitId":"LBU00001","name":"BU_Deluxe"},
        {"businessUnitId":"LBU00005","name":"DataTransfer", "parent": "pcBusinessUnit"},
        {"businessUnitId":"LBU00002","name":"Amazon"},
        {"businessUnitId":"LBU00003","name":"Stanley", "parent": "pcBusinessUnit"} // Duplicate name with a different parent
    ]
};

// Run the function and log the output
console.log(createBusinessUnitPath(input));
