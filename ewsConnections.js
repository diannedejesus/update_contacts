const crypto = require ("crypto");
const EWS = require('node-ews');
const NTLMAuth = require('httpntlm').ntlm;

module.exports = {
    addDates: async function(password, email, options) {
        const algorithm = "aes-256-cbc"; 
        // the decipher function
        const decipher = crypto.createDecipheriv(algorithm, process.env.Skey, process.env.initVector);
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
            'attributes': {
                'SendMeetingInvitations': 'SendToAllAndSaveCopy'
            },
            'Items': {
                'CalendarItem': {
                    'ReminderIsSet': true,
                    'ReminderMinutesBeforeStart': 60,
                    'IsAllDayEvent':false,
                    'LegacyFreeBusyStatus': 'Busy',
                    'RequiredAttendees': {
                        'Attendee': {
                            'Mailbox': {
                                'EmailAddress': 'djesus@gurabopr.com'
                            }
                        }
                    }, //can't get it to send email to attendees
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
        const algorithm = "aes-256-cbc"; 
        // the decipher function
        const decipher = crypto.createDecipheriv(algorithm, process.env.Skey, process.env.initVector);
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
                "Subject" : options.Subject,
                "Body" : {
                  "attributes": {
                    "BodyType" : "HTML"
                  },
                  "$value": options.Body
                },
                "ToRecipients" : {
                  "Mailbox" : {
                    "EmailAddress" : options.Email
                  }
                },
                "IsRead": "false"
              }
            }
        };

        //console.log(ewsArgs.Items.Message.Body.$value)
        //console.log(ewsArgs.Items.Message.ToRecipients.Mailbox.EmailAddress)
        // query EWS and print resulting JSON to console
        ews.run(ewsFunction, ewsArgs)
        .then(result => {
            console.log(JSON.stringify(result));
        })
        .catch(err => {
            console.log(err.message);
        });
    },

    getContacts: async function(password, email, options) {
      const algorithm = "aes-256-cbc"; 
      // the decipher function
      const decipher = crypto.createDecipheriv(algorithm, process.env.Skey, process.env.initVector);
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

      const ewsFunction = 'FindItem';
      const ewsArgs = {
          'ItemShape': {
            'BaseShape': 'Default',
          },

          // 'Restriction': {
          //     'Contains': {
          //       'attributes': {
          //         'ContainmentMode': 'FullString', 
          //         'ContainmentComparison': 'IgnoreCase'
          //       },
          //       'FieldURI': {
          //           'attributes': {
          //             'FieldURI': 'contacts:JobTitle' 
          //           }
          //       },
          //       'FieldURIOrConstant' : {
          //         'Constant': {
          //           'attributes': {
          //             'Value': 'Landlord' 
          //           }
          //         }
          //       }
          //     }
          // },

          'ParentFolderIds': {
            'DistinguishedFolderId' : {
              'attributes': {
                'Id': "contacts"
              }
            }
          },
              
      };


      // query EWS and print resulting JSON to console
     return ews.run(ewsFunction, ewsArgs)
      .then(result => {
          //console.log(JSON.stringify(result));
          //console.log(result.ResponseMessages.FindItemResponseMessage.RootFolder.Items.Contact[0].JobTitle)
          return result
      })
      .catch(err => {
          console.log(err.message);
      });
  },

}