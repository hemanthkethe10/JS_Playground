let applications = 
[{"type":"HumanSystem","name":"test-subscription","businessUnits":[]},{"type":"AdvancedRouting","name":"UseThisSubscription","businessUnits":["ct2-bu"]},{"type":"AdvancedRouting","name":"AdvancedRoute","businessUnits":[]},{"type":"AuditLogMaint","name":"Audit Log Maintenance","businessUnits":[]},{"type":"TransferLogMaint","name":"Transfer Log Maintenance","businessUnits":[]},{"type":"LogEntryMaint","name":"LogEntry Maintenance","businessUnits":[]},{"type":"PackageRetentionMaint","name":"Package Retention Maintenance","businessUnits":[]},{"type":"SentinelLinkDataMaint","name":"Sentinel Link Data Maintenance","businessUnits":[]},{"type":"AdvancedRouting","name":"NYL-AdvancedRoute","businessUnits":["samsol161025","Development","Accounting","Ekart","BuildRight522","EnterpriseApplications BU","Nothing129","Dish","Healthcare systems","securesystems","Nothing309","Bru","GBS_FileView_Test","Europe","Acerlite","GBS-SFR1","CloudServices","Orange","Common71","ComplianceServices","GenPop_Test","test421","vaishnaviBU Unit","Valuelabs","GBS_SFR","acesecuresystems","vaibu","ComplianceStrategy","Corporate Services","dellplus","relisol","ProductionFreeze","TravelSphere914","Common2","Riseabove","SFTP Solutions","Goldmedal","Box","Fileview_Business_unit","Asussolutions"]},{"type":"AdvancedRouting","name":"AdvancedRouteSubscription","businessUnits":[]},{"type":"AdvancedRouting","name":"Advanced Routing","businessUnits":["Development"]},{"type":"Basic","name":"testBaseApplication","businessUnits":[]}]


const ALLOWED_TYPES = ["HumanSystem", "AdvancedRouting", "Basic"];

function filterApplicationsByBusinessUnit(input) {
  if (!Array.isArray(input.applications)) {
    return [];
  }

  if (!input.businessUnit || typeof input.businessUnit !== 'string') {
    return [];
  }

  const filteredApplications = input.applications.filter(app => {
    // First check: type must be in the allowed list
    if (!ALLOWED_TYPES.includes(app.type)) {
      return false;
    }

    // Second check: businessUnits criteria
    // Include if businessUnits is empty
    if (!app.businessUnits || app.businessUnits.length === 0) {
      return true;
    }
    
    // Include if businessUnit is in the list
    return app.businessUnits.includes(input.businessUnit);
  });

  // Transform to dropdown format if requested
  if (input.forDropdown === 'true') {
    return filteredApplications.map(app => ({
      label: app.name,
      value: app.name
    }));
  }

  return filteredApplications;
}

module.exports = filterApplicationsByBusinessUnit;


const filteredByDevelopment = filterApplicationsByBusinessUnit(applications, 'Development');
console.log('Applications for Development BU:', filteredByDevelopment);

const filteredByCtBu = filterApplicationsByBusinessUnit(applications, 'ct2-bu');
console.log('\nApplications for ct2-bu:', filteredByCtBu);

// Example with dropdown format
const dropdownOptions = filterApplicationsByBusinessUnit(applications, 'Development', true);
console.log('\nDropdown options for Development BU:', dropdownOptions);
