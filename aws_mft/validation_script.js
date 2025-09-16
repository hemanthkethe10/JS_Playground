function runSchema(input) {
  const { data, schema, type: operationType, requiredKeys = [], requiredArrayFields = {} } = input;

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

  function validateObject(obj, schema, operationType = "create", path = "", seenErrors = new Set()) {
  const schemaKeys = Object.keys(schema);
  const objectKeys = Object.keys(obj);

  // Top-level required key validation — only for create
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

  for (const key of objectKeys) {
    if (!schemaKeys.includes(key)) {
      const fullPath = path ? `${path}.${key}` : key;
      seenErrors.add(`Unexpected key: ${fullPath}`);
    }
  }

  return Array.from(seenErrors);
}

  return validateObject(data, schema, operationType);
};

let input = {"libraryScriptId":"682dcfdef3a759c617483f31","data":{"requestId":"OBRQ00448","partnerId":"PART00117","status":"Created","createdBy":"ravitejar@backflipt.com","updatedAt":1748011233787,"onboardingContact":{"userName":"S","email":"S@gamil.com"},"connectionInfo":{"tentativeAccount":"SAMPLE","partnerToClient":{"isEnabled":true,"loginMethod":"SSHPublicKey","certificateType":"ssh","loginKey":{"fileId":"FA00114","fileName":"BU_testing21111.crt","contentType":"application/x-x509-ca-cert","fileUrl":"https://orchestrate.backflipt.com/apps/67c8236d770d11d8ce274993/files/67c8236e770d11d8ce274cba/key/FA00114/serve"}}},"isDeleted":false,"isClaimed":false,"isSubmitted":false,"createdAt":1748011233787,"businessUnitName":"Finance","partnerName":"PayPal","createdByName":"Raviteja R","mftEnvironment":"Model","updatedBy":"ravitejar@backflipt.com"},"type":"create","requiredKeys":["mftEnvironment","isDeleted","businessUnitName","createdByName","requestId","partnerId","partnerName","status","createdAt","createdBy","updatedAt","onboardingContact.userName","onboardingContact.email","connectionInfo.partnerToClient.isEnabled"],
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
			}
	},
"requiredArrayKeys":""}

console.log("Validation Result: ", runSchema(input));