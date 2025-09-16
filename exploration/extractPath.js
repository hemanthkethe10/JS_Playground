let input = {"item"	:{
    "@odata.type": "#microsoft.graph.driveItem",
    "createdBy": {
        "user": {
            "email": "adityal@backflipt.com",
            "id": "2f9cf3a8-e991-4634-801c-fdf929685894",
            "displayName": "Aditya"
        }
    },
    "createdDateTime": "2025-04-25T06:59:05Z",
    "eTag": "\"{B69AD6EC-21BD-4D62-9A8A-DC4A2E26E8CC},1\"",
    "id": "01KRYRDXPM22NLNPJBMJGZVCW4JIXCN2GM",
    "lastModifiedBy": {
        "user": {
            "email": "adityal@backflipt.com",
            "id": "2f9cf3a8-e991-4634-801c-fdf929685894",
            "displayName": "Aditya"
        }
    },
    "lastModifiedDateTime": "2025-04-25T06:59:05Z",
    "name": "ST_settings.xlsx",
    "parentReference": {
        "driveType": "documentLibrary",
        "driveId": "b!_57S4eqCCUOZug2ack3edwrVjo9pzBlPt3kPGuz8nj7LgJEFoBQUS4DMdmChLjbr",
        "id": "01KRYRDXLBULB7OHUPRFHIRNK5GFDPDOSR",
        "path": "/drives/b!_57S4eqCCUOZug2ack3edwrVjo9pzBlPt3kPGuz8nj7LgJEFoBQUS4DMdmChLjbr/root:/SharePoint to AWS S3 Sync/QA-SharePoint 2/QA-SharePoint SubFolder 4",
        "siteId": "e1d29eff-82ea-4309-99ba-0d9a724dde77"
    },
    "webUrl": "https://backflipt.sharepoint.com/sites/PlatformQA/_layouts/15/Doc.aspx?sourcedoc=%7BB69AD6EC-21BD-4D62-9A8A-DC4A2E26E8CC%7D&file=ST_settings.xlsx&action=default&mobileredirect=true",
    "cTag": "\"c:{B69AD6EC-21BD-4D62-9A8A-DC4A2E26E8CC},2\"",
    "file": {
        "hashes": {
            "quickXorHash": "dBesBLNsdz+GmEOaO329EAPXZEI="
        },
        "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },
    "fileSystemInfo": {
        "createdDateTime": "2025-04-25T06:59:05Z",
        "lastModifiedDateTime": "2025-04-25T06:59:05Z"
    },
    "shared": {
        "scope": "users"
    },
    "size": 26319
}}


function extractPathForOfficeItem(input){
    try{
    let parentRef = input.item.parentReference?.path || "";
    const match = input.item.webUrl.match(/\/sites\/([^\/]+)/);
    //const siteName = match ? match[1] : null;
    const path = parentRef.split('root:')[1] || "";
    encodedPath = path.split('/').map(encodeURIComponent).join('/');
    return `${encodedPath}/${input.item.name}`;
    } catch(error){
        return `/${input.item.name}`;
    }
}

module.exports = extractPathForOfficeItem;

console.log(extractPathForOfficeItem(input));