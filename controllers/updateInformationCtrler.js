const NameReferenceDB = require('../models/NameReference')
//const HistoricImportDB = require('../models/HistoricImport')
const SubmittedInformationDB = require('../models/SubmittedInformation')
const ewsOptions = require('../ewsConnections')
const validator = require('validator');
//const { nanoid } = require('nanoid')

module.exports = { 
    index: async (req,res)=>{
        try{
            let data, contactName
            const currentErrors = req.session.warning ? req.session.error.concat(req.session.warning) : ''
            const formInformation = req.session.body ? req.session.body : ''
            req.session.error = []
            req.session.body = []
            req.session.warning = []

            if(formInformation.length === 0 && req.params.id){
                await NameReferenceDB.findOneAndUpdate({accessLink: req.params.id}, {$inc: {accessCount: 1}})
                data = await NameReferenceDB.find({accessLink: req.params.id});
                contactName = {first: data[0].name.firstName, middle: data[0].name.middleInitial, last:data[0].name.lastName}
            }else if(formInformation.length === 0){
                await NameReferenceDB.findOneAndUpdate({accessLink: ''}, {$inc: {accessCount: 1}})
            }
            //if(!data){data.disabple}
            console.log('update information')
            res.render('updateInformation.ejs', {name: contactName, errors: currentErrors, bodyFill: formInformation, id: req.params.id, disabled: data ? data[0].disabled : false })
        }catch(err){
            console.log(err)
        }
    },

    sendReceipt: async (req,res)=>{
        try{
            let compiledInfo = {}
            //let phoneNumbers = []
            if(req.body.associate.toLowerCase() === 'yes'){
                console.log('update')
                await SubmittedInformationDB.findOneAndUpdate({_id: req.body.id}, {email: req.body.email, emailUse: req.body.selector})
            } //if yes add email to submitted data


            if(req.body.number.length > 0 && req.body.number.length === req.body.type.length){
                for(let i=0; i<req.body.number.length; i++){
                    //phoneNumbers.push({number: req.body.number[i], numberType: req.body.type[i]}) 
                    compiledInfo.phoneNumbers = compiledInfo.phoneNumbers ? compiledInfo.phoneNumbers + '<br>' + req.body.type[i] + ' ' + req.body.number[i] + ' ' : req.body.type[i] + ' ' + req.body.number[i] + ' '
                }
            }else if(req.body.number){
                //phoneNumbers.push({number: req.body.number, numberType: req.body.type})
                compiledInfo.phoneNumbers = req.body.type + ' ' + req.body.number
            }
            
            
                compiledInfo.name = req.body.firstname ? `${req.body.firstname} ${req.body.middleinitial} ${req.body.lastname}` : `${req.body.names[0]} / ${req.body.names[1]}`
                if(!compiledInfo.phoneNumbers) { compiledInfo.phoneNumbers = 'No phone numbers provided' }
                compiledInfo.email = req.body.email ? `${req.body.email}` : 'no email provided'
                compiledInfo.emailUse = req.body.selector ? req.body.selector === 'no' ? 'Oficial use only' : 'Oficial use and contacting' : 'nothing selected'
                compiledInfo.address = req.body.streetaddr ? `<br>${req.body.urbName} <br>${req.body.streetaddr} <br>${req.body.city}, ${req.body.state} ${req.body.zip}` : 'No postal address provided'

                res.render('receipt.ejs', {bodyFill: req.body})
                if(req.body.email){ module.exports.sendEmail(req.user, compiledInfo) }
            

            console.log('receipt sent')

            //res.render('updateInformation.ejs', {name: contactName, errors: currentErrors, bodyFill: formInformation, id: req.params.id, disabled: data[0].disabled})
        }catch(err){
            console.log(err)
        }
    },

    sendEmail: async (user, formInformation)=>{
        try{
            const optionsEmailClient = {
                'Name': formInformation.name,
                'Body': `Hello ${formInformation.name},<br><br>
                    
We appreciate that you took the time to update your contact information. This information will only be used for official business pertaining to our office or the houses you have under contract with our participant. Below it a reciept containing the information submitted. 
<br><br>
<hr>
<b>Name:</b> ${formInformation.name}<br><br>
<b>Address:</b> ${formInformation.address}<br><br>
<b>Phone Numbers:</b> <br>${formInformation.phoneNumbers}<br><br>
<b>Email:</b> ${formInformation.email}<br>
<b>Email Use:</b> ${formInformation.emailUse}
<hr>
<br>
Feel free to contact our office with questions or concerns by emailing or calling our office.<br><br>`, //Body: name email
                'Email': 'djs.dianne@gmail.com',
                //'Email': formInformation.email,
                'Subject': 'Thankyou for updating your information',
            }

            console.log('email sent to:', formInformation.email)

            ewsOptions.sendEmail(user.calendarPassword, user.calendarEmail, optionsEmailClient)

            console.log('Email Sent')
            //res.json('Email Sent')
        }catch(err){
            console.log(err)
        }
    },

    submitInfo: async (req, res)=>{
        try{
            req.session.error = [] //error handling
            req.session.warning = [] //error handling
            let dataSubmit = false
            let compiledInfo = {}

            if(req.body){
                req.session.body = req.body //pass filled info
                //Name field

                if(!req.body.firstname || validator.isEmpty(req.body.firstname.trim()) || validator.isEmpty(req.body.lastname.trim())){
                    if(!req.body.names || validator.isEmpty(req.body.names[0].trim())){
                        req.session.error.push('Error: Name and last name can not be empty')
                        req.session.body.submit = ''
                    }
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
                    compiledInfo.phoneNumbers = compiledInfo.phoneNumbers ? compiledInfo.phoneNumbers + '<br>' + req.body.type[i] + ' ' + req.body.number[i] + ' ' : req.body.type[i] + ' ' + req.body.number[i] + ' '
                }
            }else if(req.body.number){
                phoneNumbers.push({number: req.body.number, numberType: req.body.type})
                compiledInfo.phoneNumbers = req.body.type + ' ' + req.body.number
            }

            //console.log(phoneNumbers)
            compiledInfo.name = req.body.firstname ? `${req.body.firstname} ${req.body.middleinitial} ${req.body.lastname}` : `${req.body.names[0]} / ${req.body.names[1]}`
            if(!compiledInfo.phoneNumbers) { compiledInfo.phoneNumbers = 'No phone numbers provided' }
            compiledInfo.email = req.body.email ? `${req.body.email}` : 'no email provided'
            compiledInfo.emailUse = req.body.selector ? req.body.selector === 'no' ? 'Oficial use only' : 'Oficial use and contacting' : 'nothing selected'
            compiledInfo.address = req.body.streetaddr ? `<br>${req.body.urbName} <br>${req.body.streetaddr} <br>${req.body.city}, ${req.body.state} ${req.body.zip}` : 'No postal address provided'

            //no access link was used or provided
            console.log(req.body.firstname ? req.body.firstname : req.body.names[0])
            if(!req.body.accessLink){
                const nameFind = await NameReferenceDB.find({'name.firstName': req.body.firstname ? req.body.firstname : req.body.names[0]}).collation( { locale: 'en', strength: 2 } )
                req.body.accessLink = ''
                for(items of nameFind){
                    req.body.accessLink += items.accessLink + '$' + `${items.name.firstName}$${items.name.middleInitial}$${items.name.lastName}` + ' '
                }
                console.log('names', req.body.accessLink)

            }

            if(dataSubmit){
                let submission = await SubmittedInformationDB.create({
                    name: {
                        firstName: req.body.firstname ? req.body.firstname : req.body.names[0],
                        middleInitial: req.body.middleinitial ? req.body.middleinitial : '/',
                        lastName: req.body.lastname ? req.body.lastname :  req.body.names[1],
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

                res.render('receipt.ejs', {bodyFill: req.body, id: submission._id})
                if(req.body.email){ module.exports.sendEmail(req.user, compiledInfo) }
            }else if(dataSubmit === true) {
                //for testing without submitting to database
                res.render('receipt.ejs', {bodyFill: req.body})
                module.exports.sendEmail(req.user, compiledInfo)
            }

            console.log('submitted!')
            
        }catch(err){
            console.log(err)
        }
    },

}    