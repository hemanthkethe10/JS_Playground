module.exports = (input) => {
    let baseQuery = "SELECT EventTimestamp, UserId AS 'Source', ProtocolFileName, State, FileSize, Direction, Protocol FROM historic_1353341185 WHERE ReceiverId != 'mft-env' AND Protocol != 'AdHOC'";
  
    // Additional filters
    if (input.direction) {
      const d = input.direction === "Inbound" ? "R" : "S";
      baseQuery += ` AND Direction = '${d}'`;
    }
  
    if (input.status) {
      const status = input.status === "Delivered" ? "('AVAILABLE', 'POST_PROC/ROUTED', 'POST_PROC', 'SENT', 'POST_PROC/ARCHIVED')" : "('FAILED')";
      baseQuery += ` AND State IN ${status}`;
    } else {
      const status = "('AVAILABLE', 'POST_PROC/ROUTED', 'POST_PROC', 'SENT', 'POST_PROC/ARCHIVED', 'FAILED')";
      baseQuery += ` AND State IN ${status}`;
    }
  
    if (input.businessUnit && !input.isAdmin) {
      baseQuery += ` AND GroupName = '${input.businessUnit}'`;
    }
  
    if (input.partnerName) {
      baseQuery += ` AND UserId = '${input.partnerName}'` ;
    }
  
    if (input.fileNamePattern) {
      baseQuery += ` AND ProtocolFileName LIKE '%${input.fileNamePattern}%'`;
    }
  
   if (input.Location) {
      baseQuery += ` AND Location = '${input.Location}'`;
    }
  
   if (input.clientName) {
      baseQuery += ` AND ClientName = '${input.clientName}'`;
    }
  
   if (input.businessTags) {
      baseQuery += ` AND BusinessTags = '${input.businessTags}'`;
    }
  
   if (input.dataSensitivity) {
      baseQuery += ` AND DataSensitivity = '${input.dataSensitivity}'`;
    }
  
    if (input.searchString) {
      baseQuery += ` AND (FileName LIKE '%${input.searchString}%' OR UserId LIKE '%${input.searchString}%' OR State LIKE '%${input.searchString}%' OR Direction LIKE '%${input.searchString}%' OR ProtocolFileName LIKE '%${input.searchString}%' 
  OR Protocol LIKE '%${input.searchString}%')`;
    }
  
    // Subquery to get the latest 100 records
    let subQuery = `(SELECT * FROM (${baseQuery} ORDER BY EventTimestamp DESC LIMIT 100) AS SubTable)`;
  
    // Default values for sorting and pagination in case they are not provided
  
  let sortingParam = input.sortingParam || 'EventTimestamp DESC'; // Default sorting parameter
    const sortingOrder = input.sortingOrder || 'DESC';           // Default sorting order
    const pageSize = input?.limit ?? 25; // Default page size
    const pageNumber = input?.offset ?? 0; // Default to first page and ensure it's at least 1
  
    let finalQuery = `${subQuery} ORDER BY ${sortingParam} LIMIT ${pageSize} OFFSET ${pageNumber}`;
  
    return finalQuery;
  };
  

  const RUNNING_THRESHOLD_TIMEOUT = 60 * 60 * 1000; // 1 hour

