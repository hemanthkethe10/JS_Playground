function mergeObjects(obj1, obj2) {
    const merged = { ...obj1 };
  
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        // Check if the key exists in obj1, if not, add it
        if (!obj1.hasOwnProperty(key)) {
          merged[key] = obj2[key];
        } else {
          // If the key exists in both objects, check if they are objects themselves
          if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && !Array.isArray(obj1[key])) {
            // If they are objects, recursively merge them
            merged[key] = mergeObjects(obj1[key], obj2[key]);
          } else {
            // Otherwise, keep the value from obj1
            merged[key] = obj1[key];
          }
        }
      }
    }
  
    return merged;
  }
  
  const obj1 = {
    "_id": "650c8ac8abafbca83a483adf",
    "requestType": "New",
    "instanceType": "Model",
    "direction": "Inbound",
    "partner": "PART00369",
    "undefined": "PII",
    "externalOwner": {
      "name": "hemanth",
      "email": "hemanthkethe@backflipt.com"
    },
    "source": "Partnerhosted",
    "account": "InsuraTrust Services",
    "remoteSite": {
      "name": "Transfer-site1 SSH",
      "remoteFolder": "/NYL/V1",
      "namingPattern": "YYYY-DD_claims.txt"
    },
    "currentRoutes": [
      {
        "routeName": "Claims Route",
        "clientName": "Disney",
        "pgpDecrypt": {
          "enabled": "true"
        },
        "unzip": {
          "enabled": "false"
        },
        "fileDescription": "This is for txt files.",
        "fileNamingPattern": "YYYY-MM-DD_CLAIMS.txt",
        "fileNamingExample": "2013-04-15_CLAIMS.txt",
        "fileId": "F00013",
        "businessTag": "businessTag",
        "comments": "Comments related to route",
        "destinations": [
          {
            "destinationName": "Destination to my file transfer account",
            "destinationType": "TransferAccount",
            "accountName": "Xen_flipt17",
            "folderType": "newFolder",
            "folder": "/Claims/V1",
            "renameFile": {
              "enabled": "false"
            },
            "encodingConversions": {
              "enabled": "true"
            },
            "successDelivery": {
              "enabled": "true",
              "emails": "h1@b.com,h2@b.com"
            },
            "failedDelivery": {
              "enabled": "false"
            }
          }
        ]
      }
    ],
    "createdAt": 1695320776192,
    "createdBy": "hemanthkethe@backflipt.com",
    "routeId": "RR00001",
    "claimedBy": "nikhithak@backflipt.com",
    "status": "Request Claimed",
    "isDeleted": false,
    "lastActivityTime": 1695378314266,
    "claimedByName": "Nikhitha Konda",
    "isClaimed": true
  };
  
  const obj2 = {
    "currentRoutes": [
      {
        "requireSignature": "false",
        "destinations": [
          {
            "encodingConversions": {
              "sourceEncoding": "utf8",
              "outputEncoding": "ebcdic"
            }
          }
        ]
      }
    ],
    "source": {
      "schedule": "v2",
      "cron": "cron-expr"
    },
    "requestId": "RR00001"
  };
  
  const mergedObject = mergeObjects(obj1, obj2);
  
  console.log(JSON.stringify(mergedObject, null, 2));
  

[{"label":"NYL Hosted Partner Account","value":"NYLhosted"},{"label":"Partner hosted NYL Account","value":"Partnerhosted"}]
[{"label":"My File Transfer Account","value":"TransferAccount"},{"label":"Internal Site","value":"InternalSite"},{"label":"Application Account","value":"ApplicationAccount"}]
