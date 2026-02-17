module.exports = function (input) {
  const pageText = {
    instance: {
      title: "Display the environment where the Business Unit will be created.",
      top: 18,
      left: 66
    },
    businessUnitName: {
      title: "Official name of the business unit.",
      top: -43,
      left: 135
    },
    baseFolder: {
      title: "Root directory where all files for this business unit will be stored.",
      top: 20,
      left: 84
    },
    parentBusinessUnit: {
      title: "Select the parent business unit that this business unit belongs to. This establishes the organizational hierarchy",
      top: -24,
      left: 126
    },
    htmlTemplate: {
      title: "Selects the web interface type for this Business Unit.",
      top: 20,
      left: 100
    },
    networkZone: {
      title: "Network environment or security zone where transfers will occur.",
      top: 19,
      left: 96
    },
    allowHtmlTemplateModifying: {
      title: "Enable this option to customize or edit the default HTML template.",
      top: 20,
      left: 198
    },
    allowBaseFolderModifying: {
      title: "Users can change or update the Business Unit’s base folder path used for storing and managing files.",
      top: 20,
      left: 177
    },
    allowHomeFolderModifying: {
      title: "Users can edit their assigned home folder location where personal or default files are stored.",
      top: 20,
      left: 182
    },
    allowTransferRestApiSubmission: {
      title: "When this option is selected, the members of this business unit will be allowed to trigger server initiated transfers using the Transfers RESTful API resource and retrieve file tracking information for these transfers.",
      top: -15,
      left: -14
    },

    allowTransferRestApiSettingsModification: {
      title: "Allows users to update or manage configuration settings related to the Transfers REST API access and behavior.",
      top: 21,
      left: 218
    },

    businessUnitOwnerName: {
      title: "Primary person responsible for managing this business unit.",
      top: 20,
      left: 170
    },

    businessUnitOwnerEmail: {
      title: "Email address of the primary owner for communication and alerts.",
      top: 20,
      left: 175
    },

    businessUnitSecondaryOwnerName: {
      title: "Backup or alternate contact responsible for this business unit.",
      top: 20,
      left: 235
    },

    businessUnitSecondaryOwnerEmail: {
      title: "Email address of the secondary owner for notifications and support.",
      top: 19,
      left: 233
    }

  };

  return pageText;
};

//Internal Site
module.exports = function (input) {
  let pageText = {

    instance: {
      text: "Select the SecureTransport instance where the internal site will be created.",
      top: -18,
      left: 75
    },

    cmrNumber: {
      text: "Enter the CMR number associated with this internal site request.",
      top: -18,
      left: 75
    },

    accessLevel: {
      text: "Select the access level applicable for this internal site.",
      top: -18,
      left: 75
    },

    businessUnit: {
      text: "Select the business unit associated with this internal site.",
      top: -18,
      left: 75
    },

    addToAccount: {
      text: "Select the account under which the internal site will be created.",
      top: -18,
      left: 75
    },

    siteName: {
      text: "Provide a unique name for the internal site. Use Check Availability to validate.",
      top: -18,
      left: 75
    },

    checkAvailability: {
      text: "Click to verify whether the entered site name is available in SecureTransport.",
      top: -18,
      left: 75
    },

    folderAccessLevel: {
      text: "Select the folder access level for this internal site.",
      top: -18,
      left: 75
    },

    protocol: {
      text: "Select the protocol to be used for file transfer (e.g., SFTP, FTP).",
      top: -18,
      left: 75
    },

    server: {
      text: "Enter the hostname or IP address of the SecureTransport server.",
      top: -18,
      left: 75
    },

    port: {
      text: "Enter the port number for the selected protocol.",
      top: -18,
      left: 75
    },

    networkZone: {
      text: "Select the network zone applicable for this internal site.",
      top: -18,
      left: 75
    },

    transferMode: {
      text: "Select the transfer mode for file exchanges.",
      top: -18,
      left: 75
    },

    userName: {
      text: "Enter the username used to authenticate with the internal site.",
      top: -18,
      left: 75
    },

    passwordOrSshKey: {
      text: "Choose whether authentication is done using a password or an SSH key.",
      top: -18,
      left: 75
    },

    password: {
      text: "Enter the password if password-based authentication is selected.",
      top: -18,
      left: 75
    },

    sshKey: {
      text: "Select an existing SSH key fetched from SecureTransport configuration.",
      top: -18,
      left: 75
    },

    uploadSshKey: {
      text: "Upload a valid SSH key. Accepted file types: .key, .pfx, .pem, .p12.",
      top: -18,
      left: 75
    },

    certificateType: {
      text: "Select the certificate type associated with the uploaded SSH key.",
      top: -18,
      left: 75
    },

    certificatePassword: {
      text: "Enter the certificate password if the selected certificate type requires one.",
      top: -18,
      left: 75
    },

    siteContact: {
      text: "Enter the contact person responsible for this internal site.",
      top: -18,
      left: 75
    },

    downloadFolder: {
      text: "The path, specified in the Download Folder field, must be full system path (not relative path).",
      top: -18,
      left: 75
    },

    downloadFilePatternType: {
      text: "Use dynamic date expressions in file patterns; Glob matches simple wildcards, Regex supports advanced character rules and complex matching.",
      top: -18,
      left: 75
    },

    downloadFilePattern: {
      text: "Defines the file name matching rule used to select files for transfer based on the chosen pattern type (Glob or Regex).",
      top: -18,
      left: 75
    },

    downloadFilePatternCaseSensitive: {
      text: "Enable to make the download file pattern case-sensitive.",
      top: -18,
      left: 75
    },

    subfolderMonitoring: {
      text: "Enable to monitor all subfolders under the download directory.",
      top: -18,
      left: 75
    },

    subfolderNamePatternType: {
      text: "Select whether the subfolder name pattern uses regular expression or file globbing.",
      top: -18,
      left: 75
    },

    subfolderNamePattern: {
      text: "Specify the subfolder name pattern to be monitored.",
      top: -18,
      left: 75
    },

    subfolderNamePatternCaseSensitive: {
      text: "Enable to make the subfolder name pattern case-sensitive.",
      top: -18,
      left: 75
    },

    uploadFolder: {
      text: "The path, specified in the Upload Folder field, must be full system path (not relative path).",
      top: -18,
      left: 75
    },

    overwriteUploadFolder: {
      text: "When checked, the upload folder can be modified by the Send To Partner routing step",
      top: -18,
      left: 75
    },

    attributeName: {
      text: "Enter the attribute name used for additional internal site configuration.",
      top: -18,
      left: 75
    },

    attributeValue: {
      text: "Enter the value corresponding to the attribute name.",
      top: -18,
      left: 75
    },

    addAttribute: {
      text: "Click to add another attribute for this internal site.",
      top: -18,
      left: 75
    }
  };

  return pageText;
};

//Onboarding
module.exports = function (input) {
  const pageText = {
    instance: {
      title: "Display the environment where the partner account will be created.",
      top: 3,
      left: 55
    },

    partnerToOnboard: {
      title: "List of partners to onboard. You can create new partner under Partners tab",
      top: -24,
      left: 128
    },

    partnerWebsite: {
      title: "Display the website URL of the partner organization.",
      top: -31,
      left: 101
    },

    partnerDescription: {
      title: "Display a description of the partner and their business.",
      top: 20,
      left: 120
    },

    primaryUserOfAccount: {
      title: "Specify the primary contact responsible for this partner. The provided details will be saved and associated with the partner account.",
      top: 2,
      left: -585
    },

    email: {
      title: "Enter the email address of the user.",
      top: 318,
      left: 47
    },

    secondaryEmail: {
      title: "Provide an alternate email address.",
      top: 363,
      left: 105
    },

    title: {
      title: "Enter the title of the user.",
      top: 411,
      left: 29
    },

    department: {
      title: "Provide the department of the primary user.",
      top: 459,
      left: 79
    },

    tentativeAccountName: {
      title: "Enter the partner account name. This temporary name allows you to continue creating routing requests without delays and can be finalized later by the IT Admin.",
      top: 2,
      left: -591
    },

    partnerConnectsToBoeing: {
      title: "Specify whether the partner will log in to the Boeing server to upload and submit files for transfer.",
      top: -29,
      left: 165
    },

    businessUnit: {
      title: "Select the client business unit associated with this partner.",
      top: 759,
      left: 86
    },

    ipAddress: {
      title:
        "Provide the partner IP addresses to be whitelisted by the IT Admin (comma-separated format).",
      top: 797,
      left: 68
    },


    loginMethod: {
      title: "Choose whether to log in using a password or an SSH key.",
      top: 922,
      left: 96
    },

    certificateType: {
      title: "Select the certificate type based on the provided SSH public key.",
      top: 968,
      left: 94
    },

    sshKey: {
      title: "Upload a valid SSH key (.crt, .cert, .cer, .txt, .pub).",
      top: 1017,
      left: 59
    },

    pgpEncryptionForPartner: {
      title: "Enable if files exchanged with the partner require PGP encryption.",
      top: -31,
      left: 162
    },

    partnerPgpPublicKey: {
      title: "Upload the partner's PGP public key (.asc) to send encrypted files.",
      top: 21,
      left: 143
    },

    boeingPgpPublicKey: {
      title: "Download and share the PGP public key to receive encrypted files.",
      top: -26,
      left: 138
    },


    boeingConnectsToPartner: {
      title: "Select when client connects to the partner’s SFTP server.",
      top: 600,
      left: 40
    },

    partnerSftpServerAddress: {
      title: "Provide the valid SFTP server address.",
      top: 630,
      left: 40
    },

    port: {
      title: "Provide the port number used for the SFTP connection.",
      top: 660,
      left: 40
    },

    username: {
      title: "Enter the username required to access the partner’s SFTP server.",
      top: 690,
      left: 40
    },

    authenticationMethod: {
      title: "Select whether authentication is done using an SSH key or password.",
      top: 720,
      left: 40
    },

    sshKeyDownload: {
      title: "Download the SSH key and share it with the partner.",
      top: 750,
      left: 40
    },

    password: {
      title: "Enter the password for SFTP login (if password authentication is selected).",
      top: 780,
      left: 40
    },

    whitelistingInformation: {
      title: "Share the displayed IP and connection details with the partner for whitelisting.",
      top: 810,
      left: 40
    },

    additionalInformation: {
      title: "Provide any additional details required for partner connectivity or setup.",
      top: 4,
      left: 139
    },

    fileAttachment: {
      title: "Upload any additional documentation to help onboard the partner.",
      top: -47,
      left: 107
    },


    folderAccessLevel: {
      title: "Select the folder access level for this internal site.",
      top: 1140,
      left: 129
    },

    protocol: {
      title: "Select the protocol to be used for file transfer (e.g., SFTP, FTP).",
      top: 1186,
      left: 63
    },

    downloadFolder: {
      title: "Enter the full system path where downloaded files will be stored.",
      top: 2,
      left: -628
    },

    downloadFilePatternType: {
      title: "Choose whether the download file pattern uses regular expression or file globbing.",
      top: -23,
      left: 178
    },

    downloadFilePattern: {
      title: "Specify the file name pattern to identify files for download.",
      top: 3,
      left: -598
    },

    downloadFilePatternCaseSensitive: {
      title: "Enable to make the download file pattern case-sensitive.",
      top: -40,
      left: 226
    },

    subfolderMonitoring: {
      title: "Enable to monitor all subfolders under the download directory.",
      top: -39,
      left: 131
    },

    subfolderNamePatternType: {
      title: "Select whether the subfolder name pattern uses regular expression or file globbing.",
      top: -49,
      left: 192
    },

    subfolderNamePattern: {
      title: "Specify the subfolder name pattern to be monitored.",
      top: -45,
      left: 160
    },

    subfolderNamePatternCaseSensitive: {
      title: "Enable to make the subfolder name pattern case-sensitive.",
      top: -39,
      left: 239
    },

    uploadFolder: {
      title: "Enter the full system path from where files will be uploaded.",
      top: 3,
      left: -646
    },

    overwriteUploadFolder: {
      title: "Enable to overwrite files if they already exist in the upload folder.",
      top: -16,
      left: -112
    },

    accountName: {
      title: "Enter a unique name to identify this account. This name will be used to reference the account across configurations and transfers.",
      top: -43,
      left: 102
    },

    uid: {
      title: "Specify the User ID (UID) for the account. This numeric value controls system-level ownership and permissions for files and processes.",
      top: 2,
      left: -706
    },

    gid: {
      title: "Specify the Group ID (GID) associated with the account. This determines the group-level access and shared permissions for resources.",
      top: 2,
      left: -706
    },

    changeHomePathTo: {
      title: "Provide the new home directory path for this account. Files, transfers, and operations will default to this location.",
      top: -43,
      left: 148
    },

    subscriptionFolder: {
      title: "Enter the folder path where subscribed or monitored files will be stored and processed automatically for this account.",
      top: -43,
      left: 132
    }

  };

  return pageText;
};

//Routing
module.exports = function (input) {
  const pageText = {
    selectPartner: {
      title: "Choose the partner associated with this routing request.",
      top: -24,
      left: 93
    },
    fullName: {
      title: "Name of the business user responsible for this data flow. This information is not populated in SecureTransport (ST).",
      top: 2,
      left: -670
    },
    chooseFileSource: {
      title: "Specifies the source location type from which files are retrieved. The source varies depending on the transfer direction.",
      top: -23,
      left: 123
    },
    fileRoutingSelectClient: {
      title: "Enter the client associated with the source account. If the client is a TPA, provide its name; otherwise, use the partner name.",
      top: -23,
      left: 83
    },
    fileNamePatternOrFilter: {
      title: "Filtering logic (e.g., *.zip) to select which files this route processes",
      top: 2,
      left: -576
    },
    fileNamePattern: {
      title: "Define the file selection pattern (e.g., *.zip) to determine which files this route processes. Use * to include all files.",
      top: 2,
      left: -623
    },
    fileNameExample: {
      title: "Provide a sample filename to verify that the defined pattern matches the expected files correctly.",
      top: 2,
      left: -617
    },
    selectDestinationType: {
      title: "Specifies the destination type where the files will be transferred.",
      top: -35,
      left: 148
    },
    renameFile: {
      title: "Enable this option to apply predefined naming conventions (file renaming) when delivering the files.",
      top: -30,
      left: 86
    },
    renamingExample: {
      title: "Provide an example illustrating how the file will be renamed after applying the naming rules.",
      top: 2,
      left: -377
    },

    // --- SECTION: Notifications ---
    notifySuccess: {
      title: "Enable automated email notifications for successful file transfers through SecureTransport (ST).",
      top: -30,
      left: 182
    },
    notifyFailure: {
      title: "Enable automated email notifications if a file transfer fails through SecureTransport (ST).",
      top: -30,
      left: 154
    },
    fetchingSchedule: {
      title: "The time-based interval for picking up files from the source",
      top: -25,
      left: 143
    }
  };

  return pageText;
};


module.exports = (input) => {
    if(input.request?.existingFileID?.enabled == "false"){
        input.currentRoutes.forEach((route, rIndex) => {
            if (!route.classifierIndex) {
              route.classifierIndex = input?.request?.currentRoutes[rIndex]?.classifierIndex;
            }
            if (rIndex === input?.fileDetails[rIndex]?.routeIndex) {
              route.classifierIndex = input?.fileDetails[rIndex]?.fileDetailIndex;
              route.classifier = input?.fileDetails[rIndex]?.classifier;
            }
          });
    }
   
    return input.currentRoutes;
  }



  function run(input) {
  try {
    if (
      input.pageData.paginatedRequests.result.length < parseInt(input.limit)
    ) {
      input.pageData.showMore = false;
    } else {
      input.pageData.showMore = !(
        input.pageData.offset + input.pageData.limit ===
        input.pageData.dataCount
      );
    }
    input.pageData.isEmpty = false;
    input.pageData.paginatedRequests.result.forEach((request) => {
      request.isOwner = request.createdBy === input.context.principal.userName;
      request.isSubmitted = request.submittedOn ? true : false;
      request.format = request.submittedOn ? "DATE" : "";
      request.submittedOn = request.submittedOn || "NA";
      let destinations = [];
      request?.currentRoutes?.forEach((route) => {
        destinations.push(route.destinations);
      });
      let isAllRoutesCreated = "";
      if (request.requestType === "New") {
        isAllRoutesCreated =
          request.instanceType === input.context.app.config.testInstanceName &&
          destinations.flat().every((dest) => dest.isRouteCreated === true);
      }
      if (request.requestType === "Update") {
        isAllRoutesCreated = request?.isRouteUpdated
          ? true
          : request?.isRouteUpdated ||
            request?.currentRoutes?.[0]?.destinations?.[0]?.routeProvisonDetails
              ?.updateRoutePackageStatus?.isRoutePackageUpdated ||
            false;
      }
      if (
        request.requestType === "Update" &&
        request?.resourceType === "Legacy"
      ) {
        isAllRoutesCreated = request?.currentRoutes?.reduce(
          (isRouteUpdated, route) => {
            return isRouteUpdated && route.isRouteUpdated;
          },
          true
        );
      }
      request.isClosed =
        input.pageData.prodStatus?.prodEnabled &&
        isAllRoutesCreated &&
        request.instanceType !== input.context.app.config.prodInstanceName;
      //Hide clone to prod actions when prod key is not enabled or route is not created in prod
      if (
        request?.isRouteCreatedinProd ||
        input.pageData.prodStatus?.prodEnabled === false
      ) {
        request.isClosed = false;
      }
      request.hideClone =
        request.requestType === "Update" ||
        request.requestType === "Delete" ||
        request.instanceType === input.context.app.config.prodInstanceName
          ? true
          : false;
    });
    input.pageData.currentRequests = input.pageData.currentRequests.concat(
      input.pageData.paginatedRequests.result
    );
    //ritmNumber
    input.pageData.currentRequests = input.pageData.currentRequests.map(
      (request) => {
        request.ritmNumber =
          typeof request.snowInfo !== "undefined" && request.snowInfo.ritmNumber
            ? request.snowInfo.ritmNumber
            : "NA";
        return request;
      }
    );
    return true;
  } catch (error) {
    console.log("ERROR: ", error);
  }
}


function(input) {
  let table = document.querySelector('[tag-name="table"]').children[1];
  const targetScrollPosition = table.scrollHeight;
  const currentScrollPosition = table.scrollTop;
  const duration = 600;
  const startTime = performance.now();
  function animateScroll(time) {
    const elapsed = time - startTime;
    const newPosition = currentScrollPosition + (targetScrollPosition - currentScrollPosition) * (elapsed / duration);
    table.scrollTop = newPosition;
    if (elapsed < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      table.scrollTop = targetScrollPosition;
    }
  }
  requestAnimationFrame(animateScroll);
}