function run(input) {
    try {
        let currentCount;
        let limit = parseInt(input.limit);
   
        let ootbReports = JSON.parse(input.context.ootbReports);

        if (input.showResults === "true") {
            input.pageData.offset = 0;
        }

        let ootbReportsCount = (input) => {
            return input.reports.result.filter(report => report.isOOTB === true).length;
        };

        let count = ootbReportsCount(input);

        if (input.type !== "sort") {
            input.pageData.dataCount = input.reports.count + ootbReports.length - count;

        }
        //instance to filter data based on instance dropdown
        input.pageData.selectedInstance = input.pageForm?.instanceDropdown || input.pageData.defaultInstance;
        let length = input.reports?.result?.length || 0;
        if (input.reports.result === undefined || length === 0) {
            //   input.pageData.isEmpty = true;
            input.pageData.showMore = false;
        } else {
            currentCount = parseInt(parseInt(input.pageData.offset) + limit);
            input.pageData.showMore = (currentCount < input.pageData.dataCount);
            input.pageData.isEmpty = false;
        }

        ootbReports.forEach((ootbReportName) => {
            const existingReport = input.OOTBreports.result.find(report => report.reportName === ootbReportName);
            if (!existingReport) {
                input.OOTBreports.result.unshift({
                    reportName: ootbReportName,
                    reportType: "Files",
                    createdBy: "OOTB",
                })
            }
        });

        // Update existing reports
        input.OOTBreports.result.forEach((report) => {
            if (input.context.ootbReports.includes(report.reportName)) {
                report.reportType = "Files";
                report.createdBy = "OOTB";
            }

            report.isScheduleEnabled = report?.isScheduleEnabled ? true : false;
            report.isOOTB = input.context.ootbReports.includes(report.reportName);
            report.isEditable = report?.reportType.toLowerCase() !== "files" ? true : false;
            report.format = report.lastRun ? "DATE" : "";
            report.lastRun = report.lastRun || "NA";
            report.businessUnit = report.businessUnit || "NA";

            if (!report?.scheduleInfo?.scheduleFrequency) {
                report.scheduleInfo = report.scheduleInfo || {};
                report.scheduleInfo.scheduleFrequency = "None";
            }
        });

        input.reports.result.forEach((report) => {
            // if (input.context.ootbReports.includes(report.reportName)) {
            //     report.reportType = "Files";
            //     report.createdBy = "OOTB";
            // }

            report.isScheduleEnabled = report?.isScheduleEnabled ? true : false;
            report.isOOTB = input.context.ootbReports.includes(report.reportName);
            report.isEditable = report?.reportType.toLowerCase() !== "files" ? true : false;
            report.format = report.lastRun ? "DATE" : "";
            report.lastRun = report.lastRun || "NA";
            report.businessUnit = report.businessUnit || "NA";

            if (!report?.scheduleInfo?.scheduleFrequency) {
                report.scheduleInfo = report.scheduleInfo || {};
                report.scheduleInfo.scheduleFrequency = "None";
            }
        });

        input.pageData.currentReports = input.reports.result;
     /*   if (input.pageForm?.search?.length > 0) {

            let searchByName = str => input.pageData.OOTBreports.result.filter((report) => report.reportName.toLowerCase().includes(str.toLowerCase()));
            input.pageData.OOTBreports.result = searchByName(input.pageForm.search);

        }*/
        console.log("reports", input)

        return true;
    } catch (error) {
        console.log("ERROR: ", error);
        return false;
    }
}