const { v4: uuidv4 } = require('uuid');
const generateUUID = () => {
    return uuidv4();
}

function formFoldersBulkInsertQueryFromSharePointItemsResponse(input) {
    try {
        let items = input.items;
        let triggerData = input.triggerData;
        let homeFolder = input.homeFolder || 'Documents';
        let siteNameWithDrive = input.webUrl.split('/sites')?.at(1);
        let siteName = siteNameWithDrive?.split('/')?.at(1);
        let jobId = input.jobId;
        let folderItems = [];
        
        // Only push folders to folderItems
        items.forEach(element => {
            // Only proceed if the item is a folder
            if (element.hasOwnProperty('folder')) {
                const path = (!element.hasOwnProperty('deleted')) ? element.parentReference?.path?.split('root:')?.at(1) : '';
                // Handling root-level item path
                const full_path = (element.name === 'root') ? siteName + '/' + homeFolder : siteName + '/' + homeFolder + path + '/' + element.name;
                const destination_path = triggerData.destination.bucketName + '/' + triggerData.clientName + '/' + full_path;
                const itemType = 'FOLDER'; // Since we only care about folders now
                
                let syncFileRecord = {
                    id: generateUUID(),
                    job_id: jobId,
                    file_name: element.name,
                    status: "TOBEPROCESSED",
                    source_path: full_path,
                    destination_path: destination_path,
                    client_name: triggerData.clientName,
                    source_system: triggerData.source.type,
                    destination_system: triggerData.destination.type,
                    metadata: element,
                    source_file_id: element.id,
                    acls: {},
                    started_at: new Date(),
                    completed_at: new Date(),
                    item_type: itemType
                };
                
                folderItems.push(syncFileRecord);
            }
        });

        let fileRecordsToInsert = [];
        // Formatting the folderItems to insert into the database (Postgresql)
        Object.entries(folderItems).forEach(([_, value]) => {
            let recordValues = Object.values(value).map(value => {
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
                    let jsonString = JSON.stringify(value);
                    jsonString = jsonString.replace(/'/g, "''");
                    return `'${jsonString.replace(/\?/g, '\\?')}'`;
                }

                if (typeof value === 'number') {
                    if (value.toString().length > 10) {
                        return `to_timestamp(${value / 1000})`;
                    }
                    return value;
                }

                return `'${value.replace(/'/g, "''")}'`;
            });
            fileRecordsToInsert.push(`(${recordValues.join(', ')})`);
        });

        keys = folderItems.length > 0 ? Object.keys(folderItems[0]) : [];
        let query = '';
        if (fileRecordsToInsert.length > 0) {
            query = `INSERT INTO ${input.triggerData.dataStorage.filesTableName} (${keys.join(', ')}) VALUES ${fileRecordsToInsert.flat().join(', ')}`;
            // Using ON CONFLICT to handle duplicate source_file_id. Metadata is updated with current and updated state.
            query += ` ON CONFLICT (source_file_id) DO UPDATE SET status = 'TOBEPROCESSED', job_id= '${jobId}', file_name = EXCLUDED.file_name,
            metadata = jsonb_build_object(
            'previousVersion', COALESCE(cust_synced_files.metadata -> 'currentVersion', cust_synced_files.metadata),
            'currentVersion', EXCLUDED.metadata
        ),acls=cust_synced_files.acls`;
        }
        else {
            query = `SELECT 1 AS dummy`;
        }
        
        let filesCount = folderItems.length;
        let totalItems = items.length;
        return { "hasErrors": false, query, filesCount, totalItems };
    } catch (error) {
        return { "hasErrors": true, "error": error };
    }
}

module.exports = formFoldersBulkInsertQueryFromSharePointItemsResponse;
