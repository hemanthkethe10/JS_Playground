const validator = require('validator')
function validateEmailsInDestinations(input) {
    let checkArray = [];
    function validateEmailSection(emailSection) {
        const emails = emailSection.emails.split(',').map(email => email.trim());
        const invalidEmails = emails.filter(email => !validator.isEmail(email));
        checkArray.push(invalidEmails.length > 0)
    }
    if(input.routes.length){
    input.routes.forEach(route => {
        if(route.destinations.length){
        route.destinations.forEach(destination => {
            if (destination.successDelivery?.enabled === 'true') {
                validateEmailSection(destination.successDelivery);
            }
            if (destination.failedDelivery?.enabled === 'true') {
                validateEmailSection(destination.failedDelivery);
            }
        });
    }
    });
}
    return checkArray.some((elem)=>elem === true);
}
module.exports = validateEmailsInDestinations
