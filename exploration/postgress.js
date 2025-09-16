function convertObjecttoPostgresInsertQuery(input) {
    try{
    let data = input.data;
    let keys = Object.keys(data);
    let values = Object.values(data);

    values = values.map(value => {
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

    let query = `INSERT INTO ${input.table} (${keys.join(', ')}) VALUES (${values.join(', ')});`;

    return {
        "success": true,
        "query": query
    };
}
catch(error){
    console.error('Error converting object to Postgres query', error);
    return {
        "success": false,
        "error": error
    }; 
}
}
module.exports = convertObjecttoPostgresInsertQuery;