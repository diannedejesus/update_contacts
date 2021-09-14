const crypto = require ("crypto");
const EWS = require('node-ews');
const NTLMAuth = require('httpntlm').ntlm;

module.exports = {
    addDates: async function(password, email, options) {
        console.log(password, email, options)
        const algorithm = "aes-256-cbc"; 
        // the decipher function
        const decipher = crypto.createDecipheriv(algorithm, 'testerkey12345678901234567891234', 'testerkey1234567');
        let decryptedData = decipher.update(password, "hex", "utf-8");

        decryptedData += decipher.final("utf8");


        // store the ntHashedPassword and lmHashedPassword to reuse later for reconnecting
        const ntHashedPassword = NTLMAuth.create_NT_hashed_password(decryptedData);
        const lmHashedPassword = NTLMAuth.create_LM_hashed_password(decryptedData);

        // exchange server connection info
        const ewsConfig = {
            username: email,
            nt_password: ntHashedPassword,
            lm_password: lmHashedPassword,
            host: 'https://east.exch032.serverdata.net/'
        };

        // initialize node-ews
        const ews = new EWS(ewsConfig);

        const ewsFunction = 'CreateItem';
        const ewsArgs = {
            "attributes" : {
                "SendMeetingInvitations" : "SendToAllAndSaveCopy"
            },
            'SavedItemFolderId': {
                'DistinguishedFolderId': {
                    'attributes': {
                        'Id':'calendar'
                    }
                } 
            },
            'Items': {
                'CalendarItem': {
                    'ReminderIsSet': true,
                    'ReminderMinutesBeforeStart': 60,
                    'IsAllDayEvent':false,
                    'LegacyFreeBusyStatus': 'Busy',
                    ...options
                }
            }
        };


        // query EWS and print resulting JSON to console
        ews.run(ewsFunction, ewsArgs)
        .then(result => {
            console.log(JSON.stringify(result));
        })
        .catch(err => {
            console.log(err.message);
        });
    },

    sendEmail: async function(password, email, options) {
        console.log(password, email, options)
        const algorithm = "aes-256-cbc"; 
        // the decipher function
        const decipher = crypto.createDecipheriv(algorithm, 'testerkey12345678901234567891234', 'testerkey1234567');
        let decryptedData = decipher.update(password, "hex", "utf-8");

        decryptedData += decipher.final("utf8");


        // store the ntHashedPassword and lmHashedPassword to reuse later for reconnecting
        const ntHashedPassword = NTLMAuth.create_NT_hashed_password(decryptedData);
        const lmHashedPassword = NTLMAuth.create_LM_hashed_password(decryptedData);

        // exchange server connection info
        const ewsConfig = {
            username: email,
            nt_password: ntHashedPassword,
            lm_password: lmHashedPassword,
            host: 'https://east.exch032.serverdata.net/'
        };

        // initialize node-ews
        const ews = new EWS(ewsConfig);

        const ewsFunction = 'CreateItem';

        const ewsArgs = {
            "attributes" : {
              "MessageDisposition" : "SendAndSaveCopy"
            },
            "SavedItemFolderId": {
              "DistinguishedFolderId": {
                "attributes": {
                  "Id": "sentitems"
                }
              }
            },
            "Items" : {
              "Message" : {
                "ItemClass": "IPM.Note",
                "Subject" : "An Appointment has been reserved",
                "Body" : {
                  "attributes": {
                    "BodyType" : "Text"
                  },
                  "$value": "You have selected the date ${options.start} - ${options.end} for your appointment. Like the selection page indicated the apppointment will be at ${options.location}. We will be discussing: ${options.subject}." //Body: name email duration
                },
                "ToRecipients" : {
                  "Mailbox" : {
                    "EmailAddress" : "djs.dianne@gmail.com"
                  }
                },
                "IsRead": "false"
              }
            }
        };

        // query EWS and print resulting JSON to console
        ews.run(ewsFunction, ewsArgs)
        .then(result => {
            console.log(JSON.stringify(result));
        })
        .catch(err => {
            console.log(err.message);
        });
    },
}