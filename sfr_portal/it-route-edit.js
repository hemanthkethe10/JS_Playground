function run(input) {
  try {
    //input.pageData.clients = input.pageData.partnerInfo.clients;
    if(input.editingUserType === "IT"){
    input.pageData.closeRequest =noActionRequired
      input.pageData.route.currentRoutes[0].destinations.every(
        (dest) => dest.isRouteCreated === true
      );
    input.pageData.notifyBusinessUserTest = input.pageData.route.status === "Closed";
    input.pageData.showRouteprogress = input.pageData.route?.isRoutingStarted ?? false;
      }
    input.pageData.showInstance = true;
    input.pageData.showDirection = true;
    input.pageData.showPartner = true;
    input.pageData.showPartnerDetails = true;
    input.pageData.isInbound = input.pageData.route.direction === "Inbound";
    input.pageData.isOutbound = input.pageData.route.direction === "Outbound";
    input.pageData.showAccountDetailsInfo = input.pageData.isInbound;
    input.pageData.showAccountDetails = input.pageData.isInbound;
    input.pageData.partnerAccounts = input.pageData.partnerInfo.accounts;
    input.pageData.fileIds = input.pageData.fileIds.result;
    let destinationAndSourcesMap={"sources":[{"label":"NYL Hosted Partner Account","value":"NYLhosted"},{"label":"Partner hosted NYL Account","value":"Partnerhosted"}],"destinations":[{"label":"My File Transfer Account","value":"TransferAccount"},{"label":"Internal Site","value":"InternalSite"},{"label":"Application Account","value":"ApplicationAccount"}]}
    input.pageData.sources = (input.pageData.route.direction === "Inbound") ? destinationAndSourcesMap.sources : destinationAndSourcesMap.destinations;
    input.pageData.destinations = (input.pageData.route.direction === "Inbound") ? destinationAndSourcesMap.destinations : destinationAndSourcesMap.sources;
    if (input.pageData.route.direction === "Inbound"){
      input.pageData.accountInfo =
        input.pageData.route.account &&
        input.pageData.partnerAccounts?.filter(
          (partner) => partner.accountName === input.pageData.route.account
        );
      input.pageData.selectedSite =
        input.pageData.route.source.siteName &&
        input.pageData.partnerTransferSites?.filter(
          (site) => site.name === input.pageData.route.source.siteName
        );
    } else {
      let source = input.pageData.route.source.name;
      input.pageData.selectedSite = input.pageData.route.source.siteName && input.pageData.partnerTransferSites?.filter(
          (site) => site.name === input.pageData.route.source.siteName
        );
      input.pageData.showApplicationAccount = source === "ApplicationAccount";
      input.pageData.showInternalSite = source === "InternalSite";
      input.pageData.showTransferAccount = source === "TransferAccount";
      input.pageData.showExistingFolder = input.pageData.route.source.folderType === "existingFolder";
      input.pageData.showNewFolder = input.pageData.route.source.folderType === "newFolder";
      input.pageData.showInternalSite = input.pageData.route.source.name === "InternalSite";
    }
    input.pageData.partnerAccounts.forEach((account) => {
      account.value = account.accountName;
      account.label = account.accountName;
    });
    input.pageData.showRemoteSite =
      input.pageData.route.source.name === "Partnerhosted";
    if (input.pageData.route?.currentRoutes?.length) {
      input.pageData.route.currentRoutes.forEach((route) => {
        //sourceFolders
        if (input.pageData.route.source?.folderType === "existingFolder") {
          let sourceFolders = input.pageData?.acountFolders?.filter(
            (info) => info.accountName === input.pageData.route.account
          );
          route.itFolders = sourceFolders?.at(0)?.result;
        }
        route.showDescription = true;
        route.showFileId = true;
        route.showFileIdDetails = true;
        route.preDeliveryDetails = true;
        route.showAddDestination = true;
        route.showCron = input.pageData.route.source.schedule === "cron";
        route.showRenameExample =
          input.pageData.route.direction === "Outbound" &&
          route.renameFile.enabled === "true";
        route.renameEnable = route.showRenameExample;
        let fileIDInfo = input.pageData.fileIds?.filter(
          (it) => it.fileId === route.fileId
        );
        if (fileIDInfo === undefined || (Array.isArray(fileIDInfo) && fileIDInfo.length === 0)
        ){} else {
         route.fileIDInfo = fileIDInfo[0];
        }
        route.destinations.forEach((destination) => {
          if (route?.destinations?.length) {
            if(input.editingUserType === "IT"){
            //For IT Admin actions
            if (input.pageData.isInbound) {
              route.requireSignature = route.pgpDecrypt.enabled === "true";
              input.pageData.showFolderSelection = true;
              route.requireSite =
                input.pageData.route.source.name === "Partnerhosted";
              destination.renameEnable =
                destination.renameFile.enabled === "true";
              destination.encodingEnable =
                destination.encodingConversions.enabled === "true";
              route.shownFolder =
                input.pageData.route.source?.folderType === "newFolder";
              route.showeFolder =
                input.pageData.route.source?.folderType === "existingFolder";
              destination.noActionRequired =
                destination.renameEnable === false &&
                destination.encodingEnable === false;
            } else {
              route.renameEnabled = route.renameFile.enabled === "true";
              route.encodingEnable =
                route.encodingConversions.enabled === "true";
              //source subscription
              input.pageData.showFolderSelection =
                input.pageData.isOutbound &&
                input.pageData.route.source.name === "InternalSite";
              //destination subscription
              destination.requireSubscription =
                input.pageData.isOutbound &&
                destination.destinationType === "NYLhosted";
              destination.noActionRequired = true;
              route.requireSite =
                input.pageData.route.source.name === "InternalSite";
              //show Folder selection
              input.pageData.showFolderSelection =
                input.pageData.route.source.name === "InternalSite";
              //destination.requireRemoteSite = input.pageData.route.source.name =="InternalSite";
              destination.showFolderIT =
                input.pageData.route.source?.folderType === "newFolder";
              //Outbound and Internal Site
              route.shownFolder =
                input.pageData.route.source.name === "InternalSite" &&
                input.pageData.route.source?.folderType === "newFolder";
              route.showeFolder =
                input.pageData.route.source.name === "InternalSite" &&
                input.pageData.route.source?.folderType === "existingFolder";
                //nopreRoutingRequired
              route.nopreRoutingRequired = route.renameEnabled === false && route.encodingEnable === false;
            }}
            if (input.pageData.isInbound) {
              destination.selectedSite = destination.remoteSite && destination.remoteSite.name && input.pageData.buInternalSites?.filter((site) => site.name === destination.remoteSite.name);
            } 
            else 
            {
              destination.selectedSite = destination.remoteSite && destination.remoteSite.name && input.pageData.partnerTransferSites?.filter((site) => site.name === destination.remoteSite.name);
            }
            destination.isInbound = !input.pageData.isInbound;
            destination.isOutbound = !input.pageData.isOutbound;
            route.showFileDestination = true;
            destination.accountInfo =
              destination.accountName &&
              input.pageData.partnerAccounts?.filter(
                (partner) => partner.accountName === destination.accountName
              );
            destination.showNewFolder = destination.folderType === "newFolder";
            destination.showExistingFolder =
              destination.folderType === "existingFolder";
            destination.showRenamingEx =
              input.pageData.route.direction === "Inbound" &&
              destination.renameFile.enabled === "true";
            destination.showPGP =
              input.pageData.route.direction === "Outbound" &&
              destination.pgpEncrypt.enabled === "true";
            destination.showPassword =
              input.pageData.route.direction === "Outbound" &&
              destination.requirePassword.enabled === "true";
            destination.showSuccessEmails =
              destination.successDelivery.enabled === "true";
            destination.showEmails =
              destination.failedDelivery.enabled === "true";
            destination.showTransferAccount =
              destination.destinationType === "TransferAccount";
            destination.showInternalSite =
              destination.destinationType === "InternalSite";
            destination.showApplicationAccount =
              destination.destinationType === "ApplicationAccount";
            destination.showRemoteSite =
              input.pageData.isOutbound &&
              destination.destinationType === "Partnerhosted";
            destination.showNHA =
              input.pageData.isOutbound &&
              destination.destinationType === "NYLhosted";
          }
        });
        input.pageData.currentRoutes = input.pageData.route.currentRoutes || [];
        input.pageData.currentRoute = input.pageData.route;
      });
      console.log("pageData==>", input.pageData);
      return true;
    }
  } catch (error) {
    console.log("error==>", error);
  }
}
//   pageData: {
//     route: {
//       _id: "6516c9dcabafbca83a58cab3",
//       requestType: "New",
//       instanceType: "Model",
//       direction: "Inbound",
//       partner: "PART00396",
//       partnerName: "HP",
//       undefined: "Non-PII",
//       externalOwner: {
//         name: "hewlett packard",
//         email: "hp@test.com",
//       },
//       source: {
//         name: "NYLhosted",
//       },
//       account: "HP-India",
//       currentRoutes: [
//         {
//           routeName: "GBSHPRouteInbound",
//           clientName: "Microsoft",
//           pgpDecrypt: {
//             enabled: "true",
//           },
//           unzip: {
//             enabled: "false",
//           },
//           fileDescription: "invoices",
//           fileNamingPattern: "hp_device_bill_{date}.txt",
//           fileNamingExample: "hp_device_bill_02Sept23.txt",
//           fileId: "F00014",
//           idValue: "OTHER00040",
//           destinations: [
//             {
//               destinationName: "Destination Invoices",
//               destinationType: "TransferAccount",
//               accountName: "nikki1234",
//               folderType: "newFolder",
//               folder: "/HP-India-Invoices",
//               renameFile: {
//                 enabled: "true",
//                 renameExample: "gbs_hp_device_bill_{Date}.txt",
//               },
//               encodingConversions: {
//                 enabled: "true",
//               },
//               successDelivery: {
//                 enabled: "false",
//               },
//               failedDelivery: {
//                 enabled: "true",
//                 emails: "nikhila@backflipt.com",
//               },
//             },
//           ],
//         },
//       ],
//       createdAt: 1695992284011,
//       createdBy: "nikhiladevathi@backflipt.com",
//       routeId: "RR00021",
//       status: "Request Claimed",
//       isDeleted: false,
//       createdByName: "Nikhila D",
//       lastActivityTime: 1695992344658,
//       submittedOn: 1695992291999,
//       claimedBy: "hithesh@backflipt.com",
//       claimedByName: "Hithesh Chowdary",
//       isClaimed: true,
//     },
//     userSTAccount: {
//       _id: "64f6f505beadbe176fcf0337",
//       testBusinessUnit: "NA",
//     },
//     partnerAccounts: [],
//     buInternalSites: [
//       {
//         type: "ssh",
//         id: "ff8080818965ea95018adbe42b2a2a2e",
//         name: "BU-Tesla-Site1",
//         account: "BU_Tesla",
//         protocol: "ssh",
//         transferType: "unspecified",
//         accessLevel: "PRIVATE",
//         host: "localhost",
//         port: "8080",
//         userName: "BU-Tesla-Site1",
//         usePassword: true,
//         password: "{AES128}sh0jJ7Yt2sweJVn1k1gCWg==",
//         label: "BU-Tesla-Site1",
//         value: "BU-Tesla-Site1",
//       },
//     ],
//     partners: [
//       {
//         label: "Xenovus-Test",
//         value: "PART00366",
//       },
//       {
//         label: "Apple",
//         value: "PART00367",
//       },
//       {
//         label: "Warner Bros. Entertainment Inc.",
//         value: "PART00368",
//       },
//       {
//         label:
//           "Warner Bros. Entertainment Inc. Warner Bros. Motion Picture Group",
//         value: "PART00369",
//       },
//       {
//         label: "Gucci",
//         value: "PART00370",
//       },
//       {
//         label: "Nasher Miles",
//         value: "PART00371",
//       },
//       {
//         label: "Asus",
//         value: "PART00372",
//       },
//       {
//         label: "Lenovo",
//         value: "PART00373",
//       },
//       {
//         label: "Zepto",
//         value: "PART00377",
//       },
//       {
//         label: "Christian Dior",
//         value: "PART00378",
//       },
//       {
//         label: "Porsche",
//         value: "PART00379",
//       },
//       {
//         label: "Tesla",
//         value: "PART00380",
//       },
//       {
//         label: "Flipkart",
//         value: "PART00384",
//       },
//       {
//         label: "Samsung",
//         value: "PART00385",
//       },
//       {
//         label: "Disney",
//         value: "PART00386",
//       },
//       {
//         label: "Ponds Powder",
//         value: "PART00387",
//       },
//       {
//         label: "Nykaa",
//         value: "PART00389",
//       },
//       {
//         label: "LG",
//         value: "PART00390",
//       },
//       {
//         label: "Amazon",
//         value: "PART00391",
//       },
//       {
//         label: "Samsung123",
//         value: "PART00392",
//       },
//       {
//         label: "Dell",
//         value: "PART00395",
//       },
//       {
//         label: "HP",
//         value: "PART00396",
//       },
//       {
//         label: "Sony",
//         value: "PART00397",
//       },
//       {
//         label: "Jio",
//         value: "PART00400",
//       },
//       {
//         label: "Armani Exchange",
//         value: "PART00401",
//       },
//       {
//         label: "Diamond",
//         value: "PART00404",
//       },
//       {
//         label: "Tata",
//         value: "PART00405",
//       },
//       {
//         label: "Nivea",
//         value: "PART00408",
//       },
//       {
//         label: "Lifestyle",
//         value: "PART00409",
//       },
//       {
//         label: "H&M",
//         value: "PART00410",
//       },
//     ],
//     partnerTransferSites: [],
//     fileIds: [
//       {
//         _id: "6516c928abafbca83a58c8ab",
//         clientName: "Microsoft",
//         type: "EFTR",
//         idValue: "EFTR00160",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//             app: "lbl1000",
//             appId: "APP-1234",
//             classifier: "specifications",
//             fileNamePattern: "specifications.pdf",
//           },
//         ],
//         fileId: "F00039",
//         partnerName: "HP",
//         label: "F00039",
//         value: "F00039",
//       },
//       {
//         _id: "6516c8daabafbca83a58c6e9",
//         clientName: "Microsoft",
//         type: "EFTR",
//         idValue: "EFTR00160",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//             app: "lbl1000",
//             appId: "APP-1234",
//             classifier: "invoices",
//             fileNamePattern: "hp_device_bill_{Date}.txt",
//           },
//         ],
//         fileId: "F00038",
//         partnerName: "HP",
//         label: "F00038",
//         value: "F00038",
//       },
//       {
//         _id: "6516ae1fabafbca83a582378",
//         clientName: "Asus",
//         type: "EFTR",
//         idValue: "EFTR00139",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//             app: "lbl1000",
//             appId: "APP-1234",
//             classifier: "1",
//             fileNamePattern: "1",
//           },
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "Non-PII",
//             app: "lbl1000",
//             appId: "APP-1234",
//             classifier: "2",
//             fileNamePattern: "2",
//           },
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//             app: "lbl1000",
//             appId: "APP-1234",
//             classifier: "3",
//             fileNamePattern: "3",
//           },
//         ],
//         fileId: "F00037",
//         partnerName: "Xenovus-Test",
//         label: "F00037",
//         value: "F00037",
//       },
//       {
//         _id: "65161df2abafbca83a55fbbb",
//         clientName: "Tesla Europe",
//         type: "EFTR",
//         idValue: "EFTR00159",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00036",
//         partnerName: "Tesla",
//         label: "F00036",
//         value: "F00036",
//       },
//       {
//         _id: "6515e022abafbca83a55e383",
//         clientName: "Client1",
//         type: "EFTR",
//         idValue: "EFTR00159",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00035",
//         partnerName: "Tesla",
//         label: "F00035",
//         value: "F00035",
//       },
//       {
//         _id: "6513d136abafbca83a51536c",
//         clientName: "Apple",
//         type: "EFTR",
//         idValue: "",
//         fileId: "F00034",
//         partnerName: "Apple",
//         label: "F00034",
//         value: "F00034",
//       },
//       {
//         _id: "6513d0c1abafbca83a514ff4",
//         clientName: "Asus",
//         type: "EFTR",
//         idValue: "",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00033",
//         partnerName: "Xenovus-Test",
//         label: "F00033",
//         value: "F00033",
//       },
//       {
//         _id: "6512b2c9abafbca83a50371a",
//         clientName: "test1",
//         type: "OTHER",
//         idValue: "OTHER00061",
//         fileDetails: null,
//         fileId: "F00032",
//         partnerName: "Apple",
//         label: "F00032",
//         value: "F00032",
//       },
//       {
//         _id: "6512ab14abafbca83a500544",
//         clientName: "Xeno 2",
//         type: "OTHER",
//         idValue: "OTHER00060",
//         fileDetails: null,
//         fileId: "F00031",
//         partnerName: "Xenovus-Test",
//         label: "F00031",
//         value: "F00031",
//       },
//       {
//         _id: "65126f3eabafbca83a4f7901",
//         clientName: "Xen1",
//         type: "EFTR",
//         idValue: "EFTR00139",
//         fileDetails: null,
//         fileId: "F00030",
//         partnerName: "Xenovus-Test",
//         label: "F00030",
//         value: "F00030",
//       },
//       {
//         _id: "65126edbabafbca83a4f772a",
//         clientName: "Xeno 2",
//         type: "OTHER",
//         idValue: "OTHER00057",
//         fileDetails: null,
//         fileId: "F00029",
//         partnerName: "Xenovus-Test",
//         label: "F00029",
//         value: "F00029",
//       },
//       {
//         _id: "6511b05dabafbca83a4f4f1b",
//         clientName: "Gold",
//         type: "EFTR",
//         idValue: "EFTR00145",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00028",
//         partnerName: "Diamond",
//         label: "F00028",
//         value: "F00028",
//       },
//       {
//         _id: "6511af1fabafbca83a4f49a4",
//         clientName: "Xeno 2",
//         type: "OTHER",
//         idValue: "OTHER00056",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00027",
//         partnerName: "Xenovus-Test",
//         label: "F00027",
//         value: "F00027",
//       },
//       {
//         _id: "6511adb5abafbca83a4f4697",
//         clientName: "Xeno 2",
//         type: "EFTR",
//         idValue: "",
//         fileId: "F00026",
//         partnerName: "Xenovus-Test",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "Non-PII",
//           },
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//           },
//         ],
//         label: "F00026",
//         value: "F00026",
//       },
//       {
//         _id: "6511acddabafbca83a4f4229",
//         clientName: "Xen1",
//         type: "OTHER",
//         idValue: "OTHER00055",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00025",
//         partnerName: "Xenovus-Test",
//         label: "F00025",
//         value: "F00025",
//       },
//       {
//         _id: "6511ac07abafbca83a4f3fee",
//         clientName: "Xen new",
//         type: "OTHER",
//         idValue: "OTHER00054",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00024",
//         partnerName: "Xenovus-Test",
//         label: "F00024",
//         value: "F00024",
//       },
//       {
//         _id: "6511aa12abafbca83a4f3913",
//         clientName: "Add New Client",
//         type: "OTHER",
//         idValue: "OTHER00053",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00023",
//         partnerName: "Xenovus-Test",
//         label: "F00023",
//         value: "F00023",
//       },
//       {
//         _id: "65119fc4abafbca83a4f13bd",
//         clientName: "Xenovus-Tes",
//         type: "EFTR",
//         idValue: "EFTR00139",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00022",
//         partnerName: "Xenovus-Test",
//         label: "F00022",
//         value: "F00022",
//       },
//       {
//         _id: "65119b4babafbca83a4ed743",
//         clientName: "Tata1",
//         type: "EFTR",
//         idValue: "EFTR00146",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "Non-PII",
//           },
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00021",
//         partnerName: "Tata",
//         label: "F00021",
//         value: "F00021",
//       },
//       {
//         _id: "651199c3abafbca83a4ec415",
//         clientName: "Diamond1",
//         type: "EFTR",
//         idValue: "EFTR00145",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00020",
//         partnerName: "Diamond",
//         label: "F00020",
//         value: "F00020",
//       },
//       {
//         _id: "65119977abafbca83a4ebfed",
//         clientName: "Diamond1",
//         type: "EFTR",
//         idValue: "EFTR00145",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "Non-PII",
//           },
//         ],
//         fileId: "F00019",
//         partnerName: "Diamond",
//         label: "F00019",
//         value: "F00019",
//       },
//       {
//         _id: "65116516abafbca83a4d13a7",
//         clientName: "Armani Exchange1",
//         type: "EFTR",
//         idValue: "EFTR00134",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "PII",
//           },
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "Non-PII",
//           },
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00015",
//         partnerName: "Armani Exchange",
//         label: "F00015",
//         value: "F00015",
//       },
//       {
//         _id: "6502d2cf6c5cc1743caebe73",
//         type: "OTHER",
//         idValue: "OTHER00040",
//         clientName: "Porsche client 1",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "Non-PII",
//           },
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//           },
//         ],
//         fileId: "F00014",
//         partnerName: "Porsche",
//         label: "F00014",
//         value: "F00014",
//       },
//       {
//         _id: "6501ade66c5cc1743cad2d46",
//         type: "EFTR",
//         idValue: "EFTR00096",
//         clientName: "Apple",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00013",
//         partnerName: "Apple",
//         label: "F00013",
//         value: "F00013",
//       },
//       {
//         _id: "65017f0f6c5cc1743cacbd59",
//         type: "OTHER",
//         idValue: "OTHER00038",
//         clientName: "Warner Bros. Entertainment Inc. client",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//           },
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//           },
//         ],
//         fileId: "F00012",
//         partnerName: "Warner Bros. Entertainment Inc.",
//         label: "F00012",
//         value: "F00012",
//       },
//       {
//         _id: "64ff54bb6c5cc1743caa2327",
//         type: "EFTR",
//         idValue: "EFTR00065",
//         clientName: "Nasher Miles client",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//           },
//         ],
//         fileId: "F00009",
//         partnerName: "Nasher Miles",
//         label: "F00009",
//         value: "F00009",
//       },
//       {
//         _id: "64ff47526c5cc1743caa1a4e",
//         type: "OTHER",
//         idValue: "OTHER00034",
//         clientName:
//           "Warner Bros. Entertainment Inc. Warner Bros. Motion Picture Group",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "Non-PII",
//           },
//         ],
//         fileId: "F00008",
//         partnerName: "Nasher Miles",
//         label: "F00008",
//         value: "F00008",
//       },
//       {
//         _id: "64ff44296c5cc1743caa1888",
//         type: "EFTR",
//         idValue: "EFTR00064",
//         clientName: "Apple",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//           },
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//           {
//             environment: "Model",
//             division: "NYL",
//             dataSensitivity: "Non-PII",
//           },
//         ],
//         fileId: "F00007",
//         partnerName: "Apple",
//         label: "F00007",
//         value: "F00007",
//       },
//       {
//         _id: "64ff42f36c5cc1743caa176f",
//         type: "OTHER",
//         idValue: "OTHER00033",
//         clientName: "Asus",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "Non-PII",
//           },
//         ],
//         fileId: "F00006",
//         partnerName: "Asus",
//         label: "F00006",
//         value: "F00006",
//       },
//       {
//         _id: "64ff42406c5cc1743caa167b",
//         type: "EFTR",
//         idValue: "EFTR00063",
//         clientName: "Nasher Miles",
//         fileDetails: [
//           {
//             environment: "Model",
//             division: "GBS",
//             dataSensitivity: "PII",
//           },
//         ],
//         fileId: "F00005",
//         partnerName: "Nasher Miles",
//         label: "F00005",
//         value: "F00005",
//       },
//       {
//         _id: "64ff15896c5cc1743ca9ea54",
//         type: "eftr",
//         idValue: "EFTR00061",
//         clientName: "Asus",
//         fileId: "F00001",
//         partnerName: "Asus",
//         label: "F00001",
//         value: "F00001",
//       },
//     ],
//     partnerInfo: {
//       _id: "650c3d37abafbca83a47e483",
//       partnerName: "HP",
//       website: "",
//       description: "",
//       contacts: [
//         {
//           role: "Firewall/Networking Contact",
//           firstName: "James",
//           lastName: "",
//           email: "james@backflipt.com",
//           secondaryEmail: "james@backflipt.com",
//           phone: "",
//           isPrimary: true,
//         },
//       ],
//       createdAt: 1695300919647,
//       createdBy: "nikhiladevathi@backflipt.com",
//       accounts: [
//         {
//           accountName: "HP-India",
//           instance: "Model",
//           createdAt: 1695991449584,
//           createdBy: "hithesh@backflipt.com",
//           partnerId: "PART00396",
//           requestId: "OBRQ00460",
//           status: "Created",
//           businessUnit: "Tesla",
//           eftrNumber: "EFTR00160",
//         },
//       ],
//       partnerId: "PART00396",
//       isDeleted: false,
//       name: "Nikhila D",
//       clients: ["Microsoft"],
//     },
//   },
//   pageProps: {
//     "it-edit-routing-request": "undefined",
//     routeId: "RR00021",
//   },
// };
// run(input);
