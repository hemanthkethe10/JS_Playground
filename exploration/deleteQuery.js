function convertObjectToPostgresDeleteQuery(input) {
    try {
        const tableName = input.tableName;
        const filter = input.filter;
        if (!tableName) {
            throw new Error('tableName is required');
        }

        let whereClause = '';
        if (filter) {
            if (typeof filter === 'string') {
                whereClause = filter.trim().toLowerCase().startsWith('where') ? filter : `WHERE ${filter}`;
            } else if (typeof filter === 'object' && Object.keys(filter).length > 0) {
                const conditions = Object.entries(filter).map(([key, value]) => {
                    if (value === null || value === undefined) {
                        return `${key} IS NULL`;
                    }
                    if (typeof value === 'boolean') {
                        return `${key} = ${value ? 'TRUE' : 'FALSE'}`;
                    }
                    if (typeof value === 'number') {
                        return `${key} = ${value}`;
                    }
                    // Escape single quotes in strings
                    return `${key} = '${String(value).replace(/'/g, "''")}'`;
                });
                whereClause = `WHERE ${conditions.join(' AND ')}`;
            }
        }

        const query = `DELETE FROM ${tableName} ${whereClause}`.trim();
        return { hasErrors: true, query };
    } catch (error) {
        return { hasErrors: false, error };
    }
}

module.exports = convertObjectToPostgresDeleteQuery;