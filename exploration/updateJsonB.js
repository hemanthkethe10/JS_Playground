function appendObjectToPostgres(input) {
    try{
    let data = input.data;
    let tableName = input.tableName;
    let objectKeys = Object.keys(data);
    let objectValues = Object.values(data);

    fomattedValues = objectValues.map(value => {
        if (value === null || value === undefined) {
            return 'NULL';
        }

        if (typeof value === 'boolean') {
            return value ? 'TRUE' : 'FALSE'; 
        }

        if (typeof value === 'object') {
            if (value instanceof Date) {
                return `'${value.toISOString()}'`;  
            }
            return `'${JSON.stringify(value)}'`; 
        }

        if (typeof value === 'number') {
            if (value.toString().length > 10) {
                return `to_timestamp(${value / 1000})`; 
            }
            return value; 
        }

        // For long strings or URLs like deltaLink
        // Escape single quotes inside the string and ensure the string is enclosed in quotes
        return `'${value.replace(/'/g, "''")}'`;
    });

    let query = `UPDATE ${tableName} SET ${objectKeys.map((key, index) => `${key} = ${key} || ${fomattedValues[index]}`).join(', ')}`;
    if (input.filter){
        query += ` WHERE ${input.filter} RETURNING *`;
    }

    return {
        "hasErrors": false,
        "query": query
    };
}
catch(error){
    return {
        "hasErrors":true,
        "error": error
    }; 
}
}
module.exports = appendObjectToPostgres;