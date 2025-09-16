let userRoles = [{
	"label": "Business User",
	"value": "Business User"
},
{
	"label": "MFT Admin",
	"value": "IT Admin"
},
{
	"label": "Super Admin",
	"value": "Super Admin"	
}
]

function returnRoles(input) {
    let rolesObject = {};
    rolesObject["businessUser"] = input.userRoles[0].value;
    rolesObject["mftAdmin"] = input.userRoles[1].value;
    rolesObject["superAdmin"] = input.userRoles[2].value;
    return {rolesObject,"true":true,"false":false};
}
module.exports = returnRoles;