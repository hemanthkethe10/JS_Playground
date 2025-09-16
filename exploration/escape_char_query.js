function escapePostgresString(input) {
    const specialChars = [ '$', '^', '.', '+', '(', ')', '[', ']', '{', '}', '-', ':', "'"];
    //Folder names doesn't include any of these characters: " * : < > ? / \ |.
  
    let escaped_str = jsonString.replace(/'/g, "''");
    return escaped_str.replace(/\?/g, '\\?');
}

function postgresStringBuilder(input) {
    if(input.type === "FILTER")
        return "source_path ~ '^" + escapePostgresString(input.sourcePath) + "' AND item_type = 'FOLDER'";
    else if(input.type === "SUCCESS_QUERY")
        return "UPDATE "+input.filesTableName+" SET source_path = REPLACE(source_path, '"+escapePostgresString(input.sourcePath)+"', '"+escapePostgresString(input.destinationPath)+"'), destination_path = REPLACE(destination_path, '"+escapePostgresString(input.sourcePath)+"', '"+escapePostgresString(input.destinationPath)+"'), status = 'SUCCESS' WHERE source_path ~ '^"+escapePostgresString(input.sourcePath)+"' AND item_type = 'FOLDER'";
    else if(input.type === "FAILURE_QUERY")
        return "UPDATE " +input.filesTableName+"SET status = 'FAILED' WHERE source_path ~ '^"+escapePostgresString(input.sourcePath)+"' AND item_type = 'FOLDER'";
    else 
        return "";
}

module.exports = postgresStringBuilder;