    function extractUsers(input){
    let data = input.data;
    let result = [];
    data.forEach(element => {
        let current_data = {}
        if (element.grantedToV2?.siteGroup) {
            current_data["id"] = element.grantedToV2.siteGroup?.id;
            current_data["type"] = "Site Group";
            current_data["displayName"] = element.grantedToV2.siteGroup?.displayName;
            current_data["roles"] = element.roles;
        }
        else if (element.grantedToV2?.user) {
            current_data["id"] = element.grantedToV2.user?.id;
            current_data["type"] = "User";
            current_data["displayName"] = element.grantedToV2.user?.email;
            current_data["roles"] = element.roles;
        }
        else if (element?.link){
            current_data["id"] = element?.link?.webUrl;
            current_data["type"] = "Link";
            // current_data["displayName"] = element?.link?.webUrl;
            current_data["roles"] = element.roles;
        }
        else{
            current_data["id"] = element?.grantedToV2?.group?.id;
            current_data["type"] = "Group";
            current_data["displayName"] = element?.grantedToV2?.group?.displayName;
            current_data["roles"] = element?.roles;
        }
        result.push(current_data);
    });
    return result;
    }

    module.exports = extractUsers;

let input = {"data":[{"id":"QXJnb24gQUkgVGVzdCBPd25lcnM","roles":["owner"],"shareId":"QXJnb24gQUkgVGVzdCBPd25lcnM","grantedToV2":{"siteGroup":{"displayName":"Argon AI Test Owners","id":"3","loginName":"Argon AI Test Owners"}},"grantedTo":{"user":{"displayName":"Argon AI Test Owners"}}},{"id":"QXJnb24gQUkgVGVzdCBWaXNpdG9ycw","roles":["read"],"shareId":"QXJnb24gQUkgVGVzdCBWaXNpdG9ycw","grantedToV2":{"siteGroup":{"displayName":"Argon AI Test Visitors","id":"4","loginName":"Argon AI Test Visitors"}},"grantedTo":{"user":{"displayName":"Argon AI Test Visitors"}}},{"id":"QXJnb24gQUkgVGVzdCBNZW1iZXJz","roles":["write"],"shareId":"QXJnb24gQUkgVGVzdCBNZW1iZXJz","grantedToV2":{"siteGroup":{"displayName":"Argon AI Test Members","id":"5","loginName":"Argon AI Test Members"}},"grantedTo":{"user":{"displayName":"Argon AI Test Members"}}},{"id":"aTowIy5mfG1lbWJlcnNoaXB8aGl0aGVzaEBiYWNrZmxpcHQuY29t","roles":["write"],"shareId":"aTowIy5mfG1lbWJlcnNoaXB8aGl0aGVzaEBiYWNrZmxpcHQuY29t","grantedToV2":{"user":{"@odata.type":"#microsoft.graph.sharePointIdentity","displayName":"Hithesh","email":"hithesh@backflipt.com","id":"3fca3578-eee3-4f5d-b62d-47d17f3cce3a"},"siteUser":{"displayName":"Hithesh","email":"hithesh@backflipt.com","id":"13","loginName":"i:0#.f|membership|hithesh@backflipt.com"}},"grantedTo":{"user":{"displayName":"Hithesh","email":"hithesh@backflipt.com","id":"3fca3578-eee3-4f5d-b62d-47d17f3cce3a"}}},{"id":"Yzowby5jfGZlZGVyYXRlZGRpcmVjdG9yeWNsYWltcHJvdmlkZXJ8YzU3NDlkZGYtNDE0YS00MTE2LTkwNGUtMGViNjhjNGJiNTY1X28","roles":["owner"],"shareId":"Yzowby5jfGZlZGVyYXRlZGRpcmVjdG9yeWNsYWltcHJvdmlkZXJ8YzU3NDlkZGYtNDE0YS00MTE2LTkwNGUtMGViNjhjNGJiNTY1X28","grantedToV2":{"group":{"@odata.type":"#microsoft.graph.sharePointIdentity","displayName":"Argon AI Test Owners","email":"ArgonAITest@backflipt.onmicrosoft.com","id":"c5749ddf-414a-4116-904e-0eb68c4bb565"},"siteUser":{"displayName":"Argon AI Test Owners","email":"ArgonAITest@backflipt.onmicrosoft.com","id":"6","loginName":"c:0o.c|federateddirectoryclaimprovider|c5749ddf-414a-4116-904e-0eb68c4bb565_o"}},"grantedTo":{"user":{"displayName":"Argon AI Test Owners","email":"ArgonAITest@backflipt.onmicrosoft.com","id":"c5749ddf-414a-4116-904e-0eb68c4bb565"}}}]}

extractUsers(input);