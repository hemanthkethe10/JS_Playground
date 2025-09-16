module.exports = function (input) {
  return {
    "schema": {
      "setupType": {
        "type": "string"
      },
      "updatedAt": {
        "type": "string"
      },
      "updatedBy": {
        "type": "string"
      },
      "smtp":{
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "userName": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "server": {
            "type": "string"
          },
          "port": {
            "type": "number"
          }
        }   
      }
    },
    "requiredKeys": [
      "updatedAt", "updatedBy", "smtp.email", "smtp.userName", "smtp.password", "smtp.server", "smtp.port"
    ]
  }
}


{"setupType":"SMTP","smtp":{"email":"mft_admin@backflipt.com","userName":"mft_admin@backflipt.com","password":"Bflipt$#4422","server":"smtp.office365.com","port":"587"},"updatedAt":1747297192691,"updatedBy":"mft_admin@backflipt.com"}