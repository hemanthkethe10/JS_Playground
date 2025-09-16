 module.exports = function (input) {
  const {
    data,
    schema,
    type: operationType,
    requiredKeys = [],
    requiredArrayFields = {}
  } = input;

  function validateType(value, expectedType, nullable = false) {
    if (nullable && value === null) return true;
    if (expectedType === "array") return Array.isArray(value);
    if (expectedType === "number") return typeof value === "number" && !isNaN(value);
    return typeof value === expectedType;
  }

  function validateRequiredKeys(obj, requiredKeys, operationType, seenErrors) {
    requiredKeys.forEach(key => {
      const parts = key.split('.');
      let current = obj;
      let exists = true;

      for (let part of parts) {
        if (current?.[part] === undefined) {
          exists = false;
          break;
        }
        current = current[part];
      }

      if (operationType === 'create') {
        if (!exists) {
          seenErrors.add(`Missing key: ${key}`);
          return;
        }
        if (current === null || current === "" || (Array.isArray(current) && current.length === 0)) {
          seenErrors.add(`Invalid empty value for required key: ${key}`);
        }
      }

      if (operationType === 'update' && exists) {
        if (current === null || current === "" || (Array.isArray(current) && current.length === 0)) {
          seenErrors.add(`Invalid empty value for required key on update: ${key}`);
        }
      }
    });
  }

  function validateArrayObjectRequiredKeys(obj, arrayPath, requiredFields, operationType, seenErrors) {
    const array = arrayPath.split('.').reduce((acc, key) => acc?.[key], obj);
    if (!Array.isArray(array)) return;

    array.forEach((item, index) => {
      requiredFields.forEach(field => {
        const value = item[field];
        if (value === undefined || (operationType === "create" && (value === null || value === ""))) {
          seenErrors.add(`Missing or empty key: ${arrayPath}[${index}].${field}`);
        }
      });
    });
  }

  function flattenObject(obj, prefix = "") {
    let result = {};
    for (let key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], fullKey));
      } else {
        result[fullKey] = obj[key];
      }
    }
    return result;
  }

  function collectSchemaPaths(schema, path = "") {
    let result = [];
    for (const key in schema) {
      const fullPath = path ? `${path}.${key}` : key;
      const rule = schema[key];
      result.push(fullPath);

      if (rule.type === "object" && rule.properties) {
        result = result.concat(collectSchemaPaths(rule.properties, fullPath));
      } else if (rule.type === "array" && rule.items?.type === "object" && rule.items.properties) {
        // skip paths like obj.arr[].subkey
        // optional: handle arrays of objects deeply here if needed
      }
    }
    return result;
  }

  function validateObject(obj, schema, operationType = "create", path = "", seenErrors = new Set()) {
    const schemaKeys = Object.keys(schema);
    const objectKeys = Object.keys(obj);

    if (path === "") {
      validateRequiredKeys(obj, requiredKeys, operationType, seenErrors);
      for (const arrayKey in requiredArrayFields) {
        validateArrayObjectRequiredKeys(obj, arrayKey, requiredArrayFields[arrayKey], operationType, seenErrors);
      }
    }

    for (const key of schemaKeys) {
      const fullPath = path ? `${path}.${key}` : key;
      const rule = schema[key];
      const value = obj[key];

      const nullable = rule.nullable || false;

      if (value === undefined) continue;

      if (rule.type === "array") {
        if (!Array.isArray(value)) {
          seenErrors.add(`Type mismatch at ${fullPath}: expected array, got ${typeof value}`);
          continue;
        }

        value.forEach((item, index) => {
          if (rule.items.type === "object") {
            validateObject(item, rule.items.properties, operationType, `${fullPath}[${index}]`, seenErrors);
          } else if (!validateType(item, rule.items.type)) {
            seenErrors.add(`Type mismatch at ${fullPath}[${index}]: expected ${rule.items.type}, got ${typeof item}`);
          }
        });

      } else if (rule.type === "object" && rule.properties) {
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
          seenErrors.add(`Expected object at ${fullPath}, got ${typeof value}`);
        } else {
          validateObject(value, rule.properties, operationType, fullPath, seenErrors);
        }

      } else if (!validateType(value, rule.type, nullable)) {
        seenErrors.add(`Type mismatch at ${fullPath}: expected ${rule.type}${nullable ? ' or null' : ''}, got ${typeof value}`);
      }
    }

    if (path === "") {
      const flatData = flattenObject(obj);
      const schemaPaths = collectSchemaPaths(schema);
      for (const key of Object.keys(flatData)) {
        if (!schemaPaths.includes(key)) {
          seenErrors.add(`Unexpected key: ${key}`);
        }
      }
    }

    return Array.from(seenErrors);
  }

  try {
    const summaryArray = validateObject(data, schema, operationType);
    return {
      hasErrors: summaryArray.length > 0,
      summary: summaryArray
    }
  } catch (error) {
    return {
      hasErrors: true,
      error: error.message || error.toString()
    }
  }
};

let input = {
  "libraryScriptId": "682dcfdef3a759c617483f31",
  "data": {
    "connectionInfo.tentativeAccount": "Hercules  OBRQ00480 New",
    "updatedAt": 1748179716288,
    "updatedBy": "neyewi7754@leabro.com"
  },
  "type": "update",
  "requiredKeys": ["mftEnvironment", "isDeleted", "businessUnitName", "createdByName", "requestId", "partnerId", "partnerName", "status", "createdAt", "createdBy", "updatedAt", "onboardingContact.userName", "onboardingContact.email", "connectionInfo.partnerToClient.isEnabled"],
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
      }
    },
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
            },
            "certificateType": {
              "type": "string"
            },
            "loginKey": {
              "type": "object",
              "properties": {
                "fileName": {
                  "type": "string"
                },
                "fileUrl": {
                  "type": "string"
                },
                "fileId": {
                  "type": "string"
                },
                "contentType": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
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
      }
    },
    "provisioningStatusDetails": {
      "type": "array",
      "items": {
        "type": "object",
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
          },
          "folderPath": {
            "type": "string"
          }
        }
      }
    },
    "submittedOn": {
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
      "properties": {
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
      }
    },
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
    },
    "submittedAt": {
      "type": "number"
    }
  },
  "requiredArrayKeys": ""
}
 

console.log(runv1(input))