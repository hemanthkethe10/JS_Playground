require('dotenv').config({ path: '../.env' });

const getEmailSmtpOptionsFromJSON = (options = {}) => {
    try {
      options = options || {};
      if ((isObject(options) || isValidJSONString(options)) && !Array.isArray(options)) {
        return isObject(options) ? options : JSON.parse(options);
      }
    } catch (err) {
    //   Logger.error('Error while parsing email options:', options, 'error:', err);
    }
    return {};
  };
  
  const mailTransporter = (input) => {
    // Logger.info('Creating custom mail transport');
    const optionsFromJSON = getEmailSmtpOptionsFromJSON(input.transport.options) || {};
    // Logger.debug('Email options from JSON:', optionsFromJSON);
  
    let options = {
      host: input.transport.mailServerHost,
      port: input.transport.mailServerPort,
      secure: parseInt(input.transport.mailServerPort) === 465, // true for 465, false for other ports
    };
  
    // Logger.debug('Basic options for SMTP:', options);
    const emailUser = input.transport.mailUserName;
    const emailPassword = input.transport.mailPassword;
    if (emailUser) {
    //   Logger.debug('Email user:', emailUser);
      setValueForPathOrDefault(options, 'auth.user', emailUser);
    }
    if (emailPassword) {
      setValueForPathOrDefault(options, 'auth.pass', emailPassword);
    }
    // Logger.debug('Auth is attached for SMTP options:', R.omit(['pass'], options.auth));
    options = R.mergeLeft(optionsFromJSON, options);
  
    // Logger.debug('Final options for SMTP:', R.omit(['auth'], options));
    return Mailer.createTransport(options);
  };
  
   const sendEmailWithCustomTransport = (tenantId, userId, unit, unitConfig, data, trace) => {
    // Logger.info('Send email with custom transport triggered for unitId:', unit._id);
    const input = unitConfig.input;
  
    // Logger.debug(
    //   'Send email with custom transport with input:',
    //   R.omit(['_auth'], input),
    //   'for unitId:',
    //   unit._id,
    // );
  
    const transporter = mailTransporter(input);
    const mailParams = R.mergeLeft(
      {
        transporter,
        attachments: prepareAttachments(input.attachments),
        body: convertDataOrThrowErrorForMail(input.body, 'body'),
      },
      input,
    );
    return sendEmail(mailParams);
  };
  
  
   let input = {
		"input": {
			"subject": "TESTING ",
			"to": "hemanthkethe@backflipt.com",
			"cc": "",
			"bcc": "",
			"body": "Testing the amazon SES server",
			"replyTo": "",
			"fromName": process.env.AWS_ACCESS_KEY_ID ,
			"priority": "normal",
			"attachments": "",
			"transport": {
				"mailServerHost": "email-smtp.us-east-1.amazonaws.com",
				"mailServerPort": "25",
				"mailUserName": process.env.AWS_ACCESS_KEY_ID ,
				"mailPassword": process.env.AWS_SECRET_ACCESS_KEY 
			},
			"fromEmailId": "adithyavarmab@backflipt.com",
			"attachments_multiValue": null
		}
}
 
   sendEmailWithCustomTransport(input)