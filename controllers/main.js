const NameReferenceDB = require('../models/NameReference')
const HistoricImportDB = require('../models/HistoricImport')
const SubmittedInformationDB = require('../models/SubmittedInformation')
const ewsOptions = require('../ewsConnections')
const validator = require('validator');
const { nanoid } = require('nanoid')

module.exports = { 
    setDates: async (req,res)=>{
        try{
            const reservationsMade = await HistoricImportDB.find()
            res.render('setDates.ejs', { reservations: reservationsMade })
        }catch(err){
            console.log(err)
        }
    },

    import: async (req, res)=>{
        try{
            const dbFilled = await HistoricImportDB.count()
            console.log(dbFilled)
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


                HistoricImportDB.insertMany(collection)
                .then(function (docs) {
                    //res.json(docs);
                    console.log(docs)
                })
                .catch(function (err) {
                    //res.status(500).send(err);
                    console.log(err)
                });

                console.log('imported')
                //res.json('imported')
                res.redirect('/setdates')
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
            
            console.log('filled')
            res.json('filled')
        }catch(err){
            console.log(err)
        }
    },

    updateInfo: async (req,res)=>{
        try{
            let data, contactName
            const currentErrors = req.session.error.concat(req.session.warning)
            const formInformation = req.session.body
            req.session.error = []
            req.session.body = []
            req.session.warning = []

            if(req.params.id){
                data = await NameReferenceDB.find({accessLink: req.params.id}, 'name');
                contactName = {first: data[0].name.firstName, middle: data[0].name.middleInitial, last:data[0].name.lastName}
            }

            console.log('update information')
            res.render('updateInformation.ejs', {name: contactName, errors: currentErrors, bodyFill: formInformation, id: req.params.id})
        }catch(err){
            console.log(err)
        }
    },

    resendEmail: async (req, res)=>{

        try{
            const reservationData = await ReservedSlotDB.findOne({linkId: req.body.idFromJSFile})
            //let durationTime = reservationData.duration

            const optionsEmailClient = {
                'Name': reservationData.name,
                'Body': `Hello ${reservationData.name},\n\nOur office needs to meet with you to complete some documentation or discuss a topic pertinate to your case. Please use the following link to schedule your appointment. \n\nIf none of these times/dates work with your schedule then please email or call us so we can find a time that works. \n\nWe will be discussing: ${reservationData.subject} and we estimate the meeting will be ${reservationData.duration}\n\n http://localhost:3000/setDates/selectTimeSlot/${reservationData.linkId}\n\n`, //Body: name email
                'Email': reservationData.email,
                'Subject': 'We need you to schedule an appointment',
            }

            ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)

            console.log('Email Sent')
            res.json('Email Sent')
        }catch(err){
            console.log(err)
        }
    },

    submitInfo: async (req, res)=>{
        try{
            req.session.error = [] //error handling
            req.session.warning = [] //error handling
            let dataSubmit = false

            if(req.body){
                req.session.body = req.body //pass filled info
                //Name field
                if(validator.isEmpty(req.body.firstname.trim()) || validator.isEmpty(req.body.lastname.trim())){
                    req.session.error.push('Error: Name and last name can not be empty')
                    req.session.body.submit = ''
                }

                //address field
                if(req.body.streetaddr.trim() || req.body.city.trim() || req.body.state.trim() || req.body.zip.trim()){
                    if(validator.isEmpty(req.body.urbName.trim()) || validator.isEmpty(req.body.streetaddr.trim()) || validator.isEmpty(req.body.city.trim()) || validator.isEmpty(req.body.state.trim()) || validator.isEmpty(req.body.zip.trim())){
                        req.session.error.push('Error: Address is incomplete you must fill all fields')
                        req.session.body.submit = ''
                    }else{
                        //req.session.warning.push('address field filled')
                    }
                }

                if(validator.isEmpty(req.body.urbName.trim()) || validator.isEmpty(req.body.streetaddr.trim()) || validator.isEmpty(req.body.city.trim()) || validator.isEmpty(req.body.state.trim()) || validator.isEmpty(req.body.zip.trim())){
                    req.session.warning.push('warning: not including an address can potential lead to missed comunications from our office and can affect you payments.')
                }

                //phone number field
                if(req.body.number.length <= 0){
                    req.session.warning.push('warning: not including a phone number can potential lead to missed comunications from our office and can affect your payments.')
                }else if(Array.isArray(req.body.number)){
                    for(items of req.body.number){
                        if(!validator.isMobilePhone(items.trim())){
                            req.session.error.push(`Error: The number ${items} is not a valid number.`)
                            req.session.body.submit = ''
                        }
                    }
                }else{
                    if(!validator.isMobilePhone(req.body.number.trim())){
                        req.session.error.push(`Error: The number ${req.body.number} is not a valid number.`)
                        req.session.body.submit = ''
                    }
                }
                
                //phone type errors, these should never showup since one is always selected by default
                if(req.body.number && req.body.number.length <= 0){
                    if(req.body.type && req.body.type.length <= 0){
                        req.session.warning.push('warning: no phone number type selected.')
                    }else if(Array.isArray(req.body.type)){
                        for(items of req.body.type){
                            if(!validator.isEmpty(items.trim())){
                                req.session.warning.push('warning: Something went wrong, a number does not have a type')
                            }
                        }
                    }else{
                        if(!validator.isEmpty(req.body.type.trim())){
                            req.session.warning.push('warning: Some went wrong, a type was not selected')
                        }
                    }
                }

                //email field
                if(validator.isEmpty(req.body.email.trim())){
                    req.session.warning.push('warning: Our office needs an email in order to process your contracts, we will not be using this email for comunication purpose unless you authorize us.')
                }else if(!validator.isEmail(req.body.email.trim())){
                    req.session.error.push('Error: not a valid email')
                    req.session.warning.push('warning: select an option')
                    req.session.body.submit = ''
                }else if(!req.body.selector || validator.isEmpty(req.body.selector)){
                    req.session.error.push('Error: please select how we may use the submitted email')
                } 
            
                
            
                //when to permit submit //must have name and last name and must not have invalid info
                if(req.session.error.length <= 0){
                    console.log('no errors found')
                    if(req.session.warning.length <= 0){
                        console.log('data submitted')
                        //ok to submit info first time
                        dataSubmit = true
                        console.log('receipt')
                        res.render('receipt.ejs', {bodyFill: req.body})
                    }else if(req.body.submit.toLowerCase() === 'submit anyway'){
                        //submit data with warnings
                        console.log('parcial data submitted')
                        dataSubmit = true
                    }else{
                        console.log('warnings found, please verify before submitting data')
                        res.redirect(req.get('referer'))
                    }
                }else{
                    console.log('errors found, do not submit data')
                    res.redirect(req.get('referer'))
                }
                
            
            } //end form error handler


            //build phone array
            let phoneNumbers = []
            if(req.body.number.length > 0 && req.body.number.length === req.body.type.length){
                for(let i=0; i<req.body.number.length; i++){
                    phoneNumbers.push({number: req.body.number[i], numberType: req.body.type[i]}) 
                }
            }else if(req.body.number){
                phoneNumbers.push({number: req.body.number, numberType: req.body.type}) 
            }
            //console.log(phoneNumbers)

            if(false){
                await SubmittedInformationDB.create({
                    name: {
                        firstName: req.body.firstname,
                        middleInitial: req.body.middleinitial,
                        lastName: req.body.lastname,
                    }, 
                    phones:phoneNumbers,
                    email: req.body.email, 
                    emailUse: req.body.selector === 'no' ? false : true, 
                    address: {
                        street: req.body.urbName + '/n' + req.body.streetaddr, 
                        city: req.body.city, 
                        state: req.body.state, 
                        zipcode: req.body.zip, 
                    },
                    timestamp: new Date(),
                //    syncedDate: 
                    accessLink: req.body.accessLink,
                })
               // res.render('receipt.ejs', {bodyFill: req.body})
            }

            console.log('submitted!')
            
        }catch(err){
            console.log(err)
        }
    },

    assignTimeSlot: async (req, res)=>{
        try{
            // await TimeSlotDB.findOneAndUpdate({linkId: req.body.idFromJSFile},{
            //     selectedSlot: new Date(req.body.dateTimeFromJSFile),
            // })

            const reservationData = await ReservedSlotDB.findOne({linkId: req.body.idFromJSFile})
            let durationTime = reservationData.duration
            const endDate = new Date(req.body.dateTimeFromJSFile).getTime() + (Number(durationTime) * 60000) //TODO use the duration but first set a standard for definition

            const options = {
                'Name': reservationData.name,
                'Subject': reservationData.subject,
                'Body': `${reservationData.name} ${reservationData.email}`,
                'Start': new Date(req.body.dateTimeFromJSFile).toISOString(),
                'End': new Date(endDate).toISOString(),
                'Location': reservationData.location,
                'Email': reservationData.email,
            }

            const optionsEmailUser = {
                'Name': reservationData.name,
                'Subject': 'An Appointment Date and Time has Been Reserved',
                'Body': `Hello ${req.user.email},\n\n${options.Name} has selected the date ${new Date(req.body.dateTimeFromJSFile).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for their appointment. \n\nThe apppointment will be at ${reservationData.location} and you will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
                'Start': new Date(req.body.dateTimeFromJSFile).toISOString(),
                'End': new Date(endDate).toISOString(),
                'Location': reservationData.location,
                'Email': req.user.calendarEmail,
            }

            const optionsEmailClient = {
                'Name': 'Your Appointment Date and Time has Been Reserved',
                'Body': `Hello ${options.Name},\n\nYou have selected the date ${new Date(req.body.dateTimeFromJSFile).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${new Date(options.Start).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} - ${new Date(endDate).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit'})} for your appointment. \n\nLike the selection page indicated the apppointment will be at ${reservationData.location}. \n\nWe will be discussing: ${reservationData.subject}.\n\n`, //Body: name email
                'Email': reservationData.email,
            }
            //save to calendar
            ewsOptions.addDates(req.user.calendarPassword, req.user.calendarEmail, options)
            ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)
            ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailUser)

            console.log('Time Slot Selected')
            res.json('Time Slot Selected')
        }catch(err){
            console.log(err)
        }
    },

    deleteDates: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await TimeSlotDB.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    