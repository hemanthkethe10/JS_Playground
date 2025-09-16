module.exports = function (input) {
  return {
    "schema": {
      "requestId": {
        "type": "string"
      },
      "partnerId": {
        "type": "string"
      },
      "status": {
        "type": "string"
      },
      "createdAt": {
        "type": "number"
      },
      "createdBy": {
        "type": "string"
      },
      "updatedAt": {
        "type": "number"
      },
      "updatedBy": {
        "type": "string"
      },
      "isClaimed": {
        "type": "boolean"
      },
      "claimedBy": {
        "type": "string"
      },
      "isAccountCreated": {
        "type": "boolean"
      },
      "onboardingContact": {
        "type": "object",
        "properties": {
        "userName": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "secondaryEmail": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "department": {
          "type": "string"
        }
      }},
      "connectionInfo": {
        "type": "object",
        "properties": {
        "tentativeAccount": {
          "type": "string"
        },
        "partnerToClient": {
        "type": "object",
        "properties": {
          "isEnabled": {
            "type": "boolean"
          },
          "loginMethod": {
            "type": "string"
          }},
          "loginKey": {
            "type": "object",
            "properties": {
            "fileName": {
              "type": "string"
            },
            "fileUrl": {
              "type": "string"
            }
          }
        }
        }
      }},
      "accountDetails": {
        "type": "object",
        "properties": {
        "accountName": {
          "type": "string"
        },
        "role": {
          "type": "string"
        },
        "policy": {
          "type": "string"
        },
        "createdBy": {
          "type": "string"
        },
        "createdAt": {
          "type": "string"
        },
        "homeDirectory": {
          "type": "string"
        },
        "optionalFolder": {
          "type": "string"
        },
        "tiqBucketName": {
          "type": "string"
        },
        "eftServerId": {
          "type": "string"
        },
        "eftServerName": {
          "type": "string"
        },
        "accountId": {
          "type": "string"
        },
        "accountFolder": {
          "type": "string"
        }
      }},
      "provisioningStatusDetails": {
        "type": "array",
        "properties": {
        "itemToProvision": {
          "type": "string"
        },
        "isSuccessfull": {
          "type": "boolean"
        },
        "timestamp": {
          "type": "number"
        },
        "message": {
          "type": "string"
        }
      }},
      "submittedAt": {
        "type": "number"
      },
      "partnerName": {
        "type": "string"
      },
      "createdByName": {
        "type": "string"
      },
      "claimedByName": {
        "type": "string"
      },
      "fileAttachment": {
        "type": "object",
        "properties":{
        "fileId": {
          "type": "string"
        },
        "fileName": {
          "type": "string"
        },
        "contentType": {
          "type": "string"
        },
        "fileUrl": {
          "type": "string"
        }
      }},
      "businessUnitName": {
        "type": "string"
      },
      "isDeleted": {
        "type": "boolean"
      },
      "isSubmitted": {
        "type": "boolean"
      },
      "mftEnvironment": {
        "type": "string"
      }
    },
    "requiredKeys": [
      "mftEnvironment", "isDeleted", "businessUnitName", "createdByName",
      "requestId", "partnerId","partnerName", "status", "createdAt", "createdBy", "updatedAt", "onboardingContact.userName", "onboardingContact.email", "connectionInfo.partnerToClient.isEnabled"
    ]
  }
}