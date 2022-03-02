const validator = require('validator');
const passport = require('passport');
const crypto = require ("crypto");
const User = require('../models/UserInfo');
const HistoricImportDB = require('../models/HistoricImport')
const NameReferenceDB = require('../models/NameReference')
const SubmittedInformationDB = require('../models/SubmittedInformation')
const VerifiedDataDB = require('../models/VerifiedData')
const ewsOptions = require('../ewsConnections')
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt');

module.exports = {
  getPage: async (req, res) => {
    let currentMessages = req.query.messages ? req.query.messages : ''
    res.render('index', {messages: currentMessages});
  },

  postLogin: async (req, res, next) => {
    const errors = [];
    if(!validator.isEmail(req.body.email)) errors.push('email is invalid');
    if(validator.isEmpty(req.body.password)) errors.push('password field cant be blank');

    if(errors.length) {
      //req.flash('errors', errors);
      let currentMessages = encodeURIComponent(errors.join(' | '))
      console.log('errors', errors)
      return res.redirect('/?messages=' + currentMessages);
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

    passport.authenticate('local', (err, user, info) => {
      if(err) return next(err);
      if(!user) {
        //req.flash('errors', info);
        console.log('errors2', info)
        return res.redirect('/');
      }
      req.logIn(user, (err) => {
        if(err) return next(err);
        res.redirect(req.session.returnTo || '/dashboard')
      })
    })(req, res, next)
  },

  getConfigure: async (req, res) => {
    //implement flash for errors
    let currentMessages = req.query.messages ? req.query.messages : ''
    const dataCount = await HistoricImportDB.count()

    
    res.render('configure', { dataCount, accountName: req.user.calendarEmail, messages: currentMessages });
  },

  addContact: async (req, res) => {
    try {
      let currentMessages = ''
      //const dataCount = await HistoricImportDB.count()
      let currentEntry = {
        name: {
            firstName: req.body.firstname,
            middleInitial: req.body.middleinitial,
            lastName: req.body.lastname,
        },
            email: req.body.email,
            phones: [],
            
            address: {
                street: req.body.urbName,
                city: req.body.city,
                state: req.body.state,
                zipcode: req.body.zip,
            },
            timestamp: new Date(),
            accessLink: nanoid(10),
        }
        if(req.body.number.length > 0 && req.body.number.length === req.body.type.length){
          for(let i=0; i<req.body.number.length; i++){
            currentEntry.phones.push({
                number: req.body.number[i], 
                numberType: req.body.type[i]
            })
          }
        } else if(req.body.number){
          currentEntry.phones.push({
            number: req.body.number, 
            numberType: req.body.type
          })
        }

      await HistoricImportDB.create(currentEntry)
      await SubmittedInformationDB.create(currentEntry)
      await NameReferenceDB.create({
        name: {
          firstName: currentEntry.name.firstName,
          middleInitial: currentEntry.name.middleInitial,
          lastName: currentEntry.name.lastName,
        },
        accessLink: currentEntry.accessLink,
      })

      currentMessages = encodeURIComponent('Entry Added')

      console.log('Entry Created')
      res.redirect('/login/configure?messages=' + currentMessages)
      
      
    } catch (err) {
      console.log(err)
    }  
  },

  editList: async (req, res) => {

    const allContacts = await HistoricImportDB.find()

    console.log('editList')
    res.render('import_database', { allContacts });
  },
 
  toggleContact: async (req, res) => {
      const contactState = await HistoricImportDB.findOne({accessLink: req.query.accessLink}, 'disabled')

      await HistoricImportDB.findOneAndUpdate({accessLink: req.query.accessLink}, {disabled: !contactState.disabled})
      await NameReferenceDB.findOneAndUpdate({accessLink: req.query.accessLink}, {disabled: !contactState.disabled})
      await VerifiedDataDB.findOneAndUpdate({accessLink: req.query.accessLink}, {disabled: !contactState.disabled})
      await SubmittedInformationDB.findOneAndUpdate({accessLink: req.query.accessLink}, {disabled: !contactState.disabled})

      res.redirect(req.get('referer'));
  },

  submitCredentials: async (req, res) => {
    const errors = [];
    let messages = ''

    if(!validator.isEmail(req.body.email)) errors.push({msg: 'email is invalid'});
    if(validator.isEmpty(req.body.password)) errors.push({msg: 'password field cant be blank'});

    if(errors.length) {
      //req.flash('errors', errors);
      console.log('errors', errors)
      return res.redirect('/');
    }

    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

    const algorithm = "aes-256-cbc"; 
    const initVector = process.env.initVector //crypto.randomBytes(16); // generate 16 bytes of random data
    const message = req.body.password;  // protected data
    const Securitykey = process.env.Skey //crypto.randomBytes(32); // secret key generate 32 bytes of random data
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector); // the cipher function

    // encrypt the message
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    
    const contact = await ewsOptions.verifyCredentials(encryptedData, req.body.email)

    //add to user info
    if(contact === 'unauthorized'){
      messages = encodeURIComponent('access was not authorized, verify your login')
      console.log('contact access not added')
    }else if(contact.ResponseMessages.FindFolderResponseMessage.attributes.ResponseClass === 'Success'){
      await User.findOneAndUpdate({email: req.user.email}, {calendarEmail: req.body.email, calendarPassword: encryptedData})
      messages = encodeURIComponent('contact access was saved')
      console.log('contact access added')
    }

    res.redirect('/login/configure?messages=' + messages)
  },

  verifyDeleteData: async (req,res)=>{
    try {
        
        console.log('verify delete data')
        res.render('verifyDeletion', {deleted: false})
    } catch (err) {
        console.log(err)
    }
},

deleteData: async (req,res)=>{
    try {
        await HistoricImportDB.deleteMany({}, function(err) { 
          console.log('HistoricImport removed') 
       }).clone();
        await NameReferenceDB.deleteMany({}, function(err) { 
          console.log('NameReference removed') 
       }).clone();
        await SubmittedInformationDB.deleteMany({}, function(err) { 
          console.log('SubmittedInformationDB removed') 
       }).clone();
        await VerifiedDataDB.deleteMany({}, function(err) { 
          console.log('VerifiedDataDB removed') 
       }).clone();

        console.log('delete data')
        res.render('verifyDeletion', {deleted: true})
    } catch (err) {
        console.log(err)
    }
},

deleteCredentials: async (req,res)=>{
    try {
      //const dataCount = await HistoricImportDB.count()
      let currentMessages = ''

      await User.findOneAndUpdate({email: req.user.email}, {calendarEmail: '', calendarPassword: ''})

      currentMessages = encodeURIComponent('Your credentials were deleted.')

      console.log('delete credentials')
      res.redirect('/login/configure?messages=' + currentMessages)
      //res.render('configure', { dataCount, accountName: req.user.calendarEmail, messages: currentMessages})
    } catch (err) {
        console.log(err)

    }
},

resetEmail: async (req,res)=>{
  try{
    //verifiy that email was enter else resend to page with error
    let error = ""
    const resetCode = nanoid(8)
    const currentDate = new Date()
    const validateEmail = await User.findOne({email: req.body.email})
    req.session.resetCode = {code: resetCode, date: currentDate, email: req.body.email}
console.log(resetCode)
    //send email
    if(!!validateEmail){
      const optionsEmailClient = {
          'Name': req.body.email,
          'Body': `Hello ${req.body.email},<br><br>
              
<p>We are sorry you are having trouble with your email. Please use the included link to reset your password. </p> 
<br><br>
<hr>
<b>Link:</b> localhost:3000/login/resetPassword/${resetCode}/ <br>
<b>Code:</b> ${resetCode} <br>
<hr>`,

          'Email': 'djs.dianne@gmail.com',
          'Subject': 'Password Reset',
      }

     ewsOptions.sendEmail(validateEmail.calendarPassword, validateEmail.calendarEmail, optionsEmailClient)

      console.log('password reset link sent')
      res.render('enterCode', {message: 'code sent to ' + req.body.email})
    }else{
      error = 'error with email'
      console.log('error with email')
      res.render('forgotPassword', {message: error})
    }
    
  }catch(err){
      console.log(err)
  }
},

verifyCode: async (req,res)=>{
  try{
    //error messages
    const currDate = new Date()
    const timeDiff = (Date.parse(currDate) - Date.parse(req.session.resetCode.date)) / 1000
    console.log(timeDiff, 'seconds')
console.log(currDate, req.session.resetCode.date)
console.log(req.session.resetCode.code, req.body.code)
    if(timeDiff < 600 && req.session.resetCode.code === req.body.code){
      console.log('code verified')
      req.session.resetCode.verified = true
      res.redirect('resetPassword')
    }else if(timeDiff >= 600){
      console.log('code timed out')
      res.redirect('/')
    }else{
      console.log('wrong code')
      res.render('enterCode', {message: 'wrong code'})
    }
  }catch(err){
      console.log(err)
  }
},

resetPassword: async (req,res)=>{
  try{
    //error messages
    if(req.session.resetCode.verified){
      if(req.body.password !== req.body.confirmPassword) {
        console.log('Error: passwords do not match')
        res.render('resetPassword', {message: 'passwords do not match', user: {email: req.session.resetCode.email}})
      }else{
        const hashPass = await bcrypt.hash(req.body.password, 10);
        const userInfo = await User.findOneAndUpdate({email: req.session.resetCode.email}, {password: hashPass})

        req.session.resetCode = ''

        console.log('password reset')
        res.redirect('/')
      } 
    }else{
      console.log('Error: code not verified')
      res.render('enterCode', {message: 'code not verified'})
    }
  }catch(err){
      console.log(err)
  }
},

getEnterCode: async (req,res)=>{
  try{
    console.log('enterCode')
    res.render('enterCode' , {message: ''})
  }catch(err){
      console.log(err)
  }
},

getResetPassword: async (req,res)=>{
  try{
    //error messages
    if(req.session.resetCode.verified){
      console.log('ResetPassword')
      res.render('resetPassword', {message: '', user: {email: req.session.resetCode.email}})
    }else{
      console.log('Error: code not verified')
      res.render('enterCode', {})
    }
    
  }catch(err){
      console.log(err)
  }
},

getForgot: async (req,res)=>{
  try{
    //error messages
    let error = ""

    console.log('Forgot')
    res.render('forgotPassword', {message: error})
  }catch(err){
      console.log(err)
  }
},

massLetter: async (req,res)=>{
  try {
    const historicData = await HistoricImportDB.find({}, 'name address accessLink')

    res.render('letter', {massSend: historicData})
  } catch (err) {
    console.log(err)
  }
},

massEmail: async (req,res)=>{
  try {
    const historicData = await HistoricImportDB.find({}, 'name email accessLink')
    let noEmailCounter = 0
    let emailCounter = 0
    let currentMessage = ''

    for(items of historicData){
      if(!items.email){ noEmailCounter++; continue }
      const optionsEmailClient = {
        'Name': `${items.name.firstName} ${items.name.lastName}`,
        'Body': `Hello ${items.name.lastName},<br><br>
          
<p>In order to process the ontract you have with our agency, we are being required to provide an email address for the signees. This email is for the use of registering your contract. You will recieve a confirmation that the contact was register and nothing else if that is your wish. For this reason our agency has decided to take advantage of this change in requierement to ask you to update your contact information. This way we have your most recent information, which will avoid problems with compliance and payments with our agency. We are using an online method for this process. Please scan the code or enter the link in a browser to update your info.</p> 
<p>If you wish to provide this information in an alternate matter you may pass by our office or call us and will we be happy to manually add your information.</p>
<br><br>${items.email}
<hr>
<b>Link:</b> localhost:3000/updateInfo/${items.accessLink}/ <br>
<hr>`,

        'Email': 'djs.dianne@gmail.com',
        'Subject': 'Update Contact Information',
      }
      //await ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)
      emailCounter++
    }
    
    if(noEmailCounter > 0 && emailCounter > 0){
      currentMessage = encodeURIComponent(`${emailCounter} emails sent and ${noEmailCounter} emails were missing`)
    }else if(noEmailCounter === 0 && emailCounter > 0){
      currentMessage = encodeURIComponent(`${emailCounter} emails were sent`)
    }else if(noEmailCounter > 0 && emailCounter === 0){
      currentMessage = encodeURIComponent(`no emails were sent and ${noEmailCounter} emails were missing`)
    }else{
      currentMessage = encodeURIComponent(`nothing happened`)
    }
    console.log("email sent to all")
    res.redirect(req.get('referer').split('?')[0] + '?messages=' + currentMessage)
  } catch (err) {
    console.log(err)
  }
},

singleEmail: async (req,res)=>{
  try {
    const historicData = await HistoricImportDB.findOne({accessLink: req.params.id})
    let currentMessage = ''

    if(historicData.email){
      const optionsEmailClient = {
        'Name': `${historicData.name.firstName} ${historicData.name.lastName}`,
        'Body': `Hello ${historicData.name.lastName},<br><br>
          
<p>In order to process the ontract you have with our agency, we are being required to provide an email address for the signees. This email is for the use of registering your contract. You will recieve a confirmation that the contact was register and nothing else if that is your wish. For this reason our agency has decided to take advantage of this change in requierement to ask you to update your contact information. This way we have your most recent information, which will avoid problems with compliance and payments with our agency. We are using an online method for this process. Please scan the code or enter the link in a browser to update your info.</p> 
<p>If you wish to provide this information in an alternate matter you may pass by our office or call us and will we be happy to manually add your information.</p>
<br><br>${historicData.email}
<hr>
<b>Link:</b> localhost:3000/updateInfo/${historicData.accessLink}/ <br>
<hr>`,

        'Email': 'djs.dianne@gmail.com',
        'Subject': 'Update Contact Information',
      }
      await ewsOptions.sendEmail(req.user.calendarPassword, req.user.calendarEmail, optionsEmailClient)
      currentMessage = encodeURIComponent('email was sent')
    }else{
      currentMessage = encodeURIComponent('contact does not have an email')
    }
    
    console.log("sent email")
    res.redirect(req.get('referer').split('?')[0] + '?messages=' + currentMessage)
  } catch (err) {
    console.log(err)
  }
}

//end export
}