const NameReferenceDB = require('../models/NameReference')
const HistoricImportDB = require('../models/HistoricImport')
const SubmittedInformationDB = require('../models/SubmittedInformation')
const VerifiedDataDB = require('../models/VerifiedData')
const ewsOptions = require('../ewsConnections')
const validator = require('validator');
const { nanoid } = require('nanoid')

module.exports = { 
    index: async (req,res)=>{
        try{
            const reservationsMade = await HistoricImportDB.find()
            const emailCount = await HistoricImportDB.find({email: {$exists: true}}).count()
            const submitCount = await SubmittedInformationDB.find().count()
            const uniqueSubmitCount = (await SubmittedInformationDB.distinct('accessLink')).length
            const accessCount = await NameReferenceDB.find({accessCount: {$exists: true}})

            let linkedAccessed = 0
            let noLinkAccessed = 0

            for(items of accessCount){
                if(items.name.firstName.toLowerCase() !== 'empty'){
                    linkedAccessed += items.accessCount
                }else{
                    noLinkAccessed = items.accessCount
                }
            }

            res.render('contactList.ejs', { 
                reservations: reservationsMade, 
                emailCount, 
                submitCount, 
                uniqueSubmitCount, 
                linkedAccessed, 
                noLinkAccessed 
            })

        }catch(err){
            console.log(err)
        }
    },

    submitList: async (req,res)=>{
        try{
            const submitData = await SubmittedInformationDB.aggregate([
                { "$group": { 
                  "_id": "$accessLink", 
                  "doc": { "$first": "$$ROOT" }
                }},
                { "$replaceRoot": {
                  "newRoot": "$doc"
                }}
              ])

            res.render('submitList.ejs', {submitData: submitData })
        }catch(err){
            console.log(err)
        }
    },

    keepAccessLinks: async (req,res)=>{
        try{
            const contactID = await SubmittedInformationDB.find({'accessLink': req.body.originalAccessLink})
            const modifyData = await SubmittedInformationDB.findOneAndUpdate({'_id': contactID[0]._id}, {'accessLink': ''}, { new: true
              })
              const modifyData2 = await SubmittedInformationDB.findOneAndUpdate({'_id': contactID[0]._id}, {'accessLink': req.body.selectedAccessLink}, { new: true
              })
            console.log(modifyData2, contactID[0]._id)

            
            console.log('access link updated via keepAccessLinks')
            res.redirect('/dashboard/submitList')
        }catch(err){
            console.log(err)
        }
    },



    compareData: async (req,res)=>{
        try{
            const originalData = await HistoricImportDB.find({accessLink: req.params.id})
            const submitData = await SubmittedInformationDB.find({accessLink: req.params.id})
            const verifiedData = await VerifiedDataDB.find({accessLink: req.params.id})


            //convert phones numbers to standard format
            let submittedNumbers = []

            for(let i=0; i<originalData[0].phones.length; i++){
                originalData[0].phones[i].number = originalData[0].phones[i].number.split('').filter(el => Number(el)).join('')
            }
        

            for(data of submitData){
                for(let i=0; i<data.phones.length; i++){
                    submittedNumbers.push(data.phones[i].number.split('').filter(el => Number(el)).join(''))  
                }
            }
//console.log(verifiedData)
            res.render('compareSubmit.ejs', { originalData: originalData, submitData: submitData, submitPhones: submittedNumbers, verifiedData: verifiedData})
        }catch(err){
            console.log(err)
        }
    },

    import: async (req, res)=>{
        try{
            const dbFilled = await HistoricImportDB.count()
            //console.log(dbFilled)
            if(dbFilled <= 0){
                const contact = await ewsOptions.getContacts(req.user.calendarPassword, req.user.calendarEmail)
                let collection = []

                for(items of contact.ResponseMessages.FindItemResponseMessage.RootFolder.Items.Contact){
                    if(items.JobTitle === 'Landlord'){
                        let currentEntry = {
                        name: {
                            firstName: items.CompleteName.FirstName,
                            middleInitial: items.CompleteName.MiddleName,
                            lastName: items.CompleteName.LastName,
                        },
                            email: items.EmailAddresses ? items.EmailAddresses.Entry[0]['$value'] : undefined,
                            phones: [],
                            
                            address: {
                                street: items.PhysicalAddresses ? items.PhysicalAddresses.Entry[0].Street : '',
                                city: items.PhysicalAddresses ? items.PhysicalAddresses.Entry[0].City : '',
                                state: items.PhysicalAddresses ? items.PhysicalAddresses.Entry[0].State : '',
                                zipcode: items.PhysicalAddresses ? items.PhysicalAddresses.Entry[0].PostalCode : '',
                            },
                            timestamp: new Date(),
                            accessLink: nanoid(10),
                        }
                        if(items.PhoneNumbers){
                            for(numbers of items.PhoneNumbers.Entry){
                                currentEntry.phones.push({
                                    number: numbers['$value'], 
                                    numberType: numbers.attributes.Key
                                })
                            }
                        }
                        collection.push(currentEntry)
                    }
                }


                await HistoricImportDB.insertMany(collection)
                .then(function (docs) {
                    //res.json(docs);
                    console.log(docs)
                })
                .catch(function (err) {
                    //res.status(500).send(err);
                    console.log(err)
                });

                await module.exports.fillReference()

                console.log('imported')
                //res.json('imported')
                res.redirect('/dashboard')
            }else{
                //error do you wish to replace database
            }
        }catch(err){
            console.log(err)
        }
    },

    fillReference: async (req,res)=>{
        try{
            const data = await HistoricImportDB.find({}, 'name accessLink');
            const emptyReference = {
                name: {
                    firstName: 'empty',
                    middleInitial: '',
                    lastName: '',
                },
                accessLink: ' ',
            }
            
            console.log(data)
            
            NameReferenceDB.insertMany(data)
                .then(function (docs) {
                    //res.json(docs);
                    console.log(docs)
                })
                .catch(function (err) {
                    //res.status(500).send(err);
                    console.log(err)
                });
            
                NameReferenceDB.create(emptyReference)

            console.log('filled')
            //res.json('filled')
        }catch(err){
            console.log(err)
        }
    },

    
    // resendEmail: async (req, res)=>{
    //     try{
    //         const reservationData = await ReservedSlotDB.findOne({linkId: req.body.idFromJSFile})
    //         //let durationTime = reservationData.duration

    //         const optionsEmailClient = {
    //             'Name': reservationData.name,
    //             'Body': `Hello ${reservationData.name},\n\nOur office needs to meet with you to complete some documentation or discuss a topic pertinate to your case. Please use the following link to schedule your appointment. \n\nIf none of these times/dates work with your schedule then please email or call us so we can find a time that works. \n\nWe will be discussing: ${reservationData.subject} and we estimate the meeting will be ${reservationData.duration}\n\n http://localhost:3000/setDates/selectTimeSlot/${reservationData.linkId}\n\n`, //Body: name email
    //             'Email': reservationData.email,
    //             'Subject': 'We need you to schedule an appointment',
    //         }

    //         ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)

    //         console.log('Email Sent')
    //         res.json('Email Sent')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },

    consolidateData: async (req, res)=>{
        try{
            console.log('body', req.body)
            //const await HistoricImportDB.find({}, 'name accessLink');
            //const submitID = req.body.id ? req.body.id : ''

            const address = req.body.address ? req.body.address.split('$') : ''
            const names = req.body.fullName ? req.body.fullName.split('$') : ''
            const email = req.body.email ? req.body.email.split('$') : ''
            
            const verifiedData = {
                name: {
                    firstName: names[0],
                    middleInitial: names[1],
                    lastName: names[2],
                },
            
                phones: [],
            
                email: req.body.email[0],
                emailUse: req.body.emailuse[1],
            
                address: {
                    street: address[0],
                    city: address[1],
                    state: address[2],
                    zipcode: address[3],
                },
            
                accessLink: req.body.accessLink,
            
                timestamp: new Date(),
            }

            for(let i=0; i<req.body.phoneNumber.length; i++){
                let numberInfo = req.body.phoneNumber[i].split('$')
                //console.log(numberInfo)
                verifiedData.phones.push({ number: numberInfo[0], numberType: numberInfo[1]})
            }

            VerifiedDataDB.create(verifiedData)

            for(let i=0; i<req.body.id.length; i++){
                //this is for changing the status or verified of submitted data
                await SubmittedInformationDB.findOneAndUpdate({_id: req.body.id[i]}, {verifiedDate: new Date()})
            }

            //console.log('verified', req.body.id)

            console.log('Data Verified')
            res.json('Data Verfied')
        }catch(err){
            console.log(err)
        }
    },

    // assignTimeSlot: async (req, res)=>{
    //     try{
    //         // await TimeSlotDB.findOneAndUpdate({linkId: req.body.idFromJSFile},{
    //         //     selectedSlot: new Date(req.body.dateTimeFromJSFile),
    //         // })

    //         const reservationData = await ReservedSlotDB.findOne({linkId: req.body.idFromJSFile})
    //         let durationTime = reservationData.duration
    //         const endDate = new Date(req.body.dateTimeFromJSFile).getTime() + (Number(durationTime) * 60000) //TODO use the duration but first set a standard for definition

    //         const options = {
    //             'Name': reservationData.name,
    //             'Subject': reservationData.subject,
    //             'Body': `${reservationData.name} ${reservationData.email}`,
    //             'Start': new Date(req.body.dateTimeFromJSFile).toISOString(),
    //             'End': new Date(endDate).toISOString(),
    //             'Location': reservationData.location,
    //             'Email': reservationData.email,
    //         }

    //         const optionsEmailUser = {
    //             'Name': reservationData.name,
    //             'Subject': 'An Appointment Date and Time has Been Reserved',
    //             'Body': `Hello ${req.user.email},\n\n${options.Name} has selected the date ${new Date(req.body.dateTimeFromJSFile).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for their appointment. \n\nThe apppointment will be at ${reservationData.location} and you will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
    //             'Start': new Date(req.body.dateTimeFromJSFile).toISOString(),
    //             'End': new Date(endDate).toISOString(),
    //             'Location': reservationData.location,
    //             'Email': req.user.calendarEmail,
    //         }

    //         const optionsEmailClient = {
    //             'Name': 'Your Appointment Date and Time has Been Reserved',
    //             'Body': `Hello ${options.Name},\n\nYou have selected the date ${new Date(req.body.dateTimeFromJSFile).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for your appointment. \n\nLike the selection page indicated the apppointment will be at ${reservationData.location}. \n\nWe will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
    //             'Email': reservationData.email,
    //         }
    //         //save to calendar
    //         ewsOptions.addDates(req.user.calendarPassword, req.user.calendarEmail, options)
    //         ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)
    //         ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailUser)

    //         console.log('Time Slot Selected')
    //         res.json('Time Slot Selected')
    //     }catch(err){
    //         console.log(err)
    //     }
    // },

    // deleteDates: async (req, res)=>{
    //     console.log(req.body.todoIdFromJSFile)
    //     try{
    //         await TimeSlotDB.findOneAndDelete({_id:req.body.todoIdFromJSFile})
    //         console.log('Deleted Todo')
    //         res.json('Deleted It')
    //     }catch(err){
    //         console.log(err)
    //     }
    // }
}    