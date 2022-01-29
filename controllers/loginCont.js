const validator = require('validator');
const passport = require('passport');
const crypto = require ("crypto");
const User = require('../models/UserInfo');
const HistoricImportDB = require('../models/HistoricImport')
const NameReferenceDB = require('../models/NameReference')
const SubmittedInformationDB = require('../models/SubmittedInformation')
const VerifiedDataDB = require('../models/VerifiedData')
const { nanoid } = require('nanoid')

module.exports = {
  getPage: async (req, res) => {
    res.render('index', {msg: 'none'});
  },

  postLogin: async (req, res, next) => {
    const errors = [];
    if(!validator.isEmail(req.body.email)) errors.push({msg: 'email is invalid'});
    if(validator.isEmpty(req.body.password)) errors.push({msg: 'password field cant be blank'});

    if(errors.length) {
      //req.flash('errors', errors);
      console.log('errors', errors)
      return res.redirect('/');
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

    // console.log("Encrypted message: " + encryptedData);
    
    //add to user info
    await User.findOneAndUpdate({email: req.user.email}, {calendarEmail: req.body.email, calendarPassword: encryptedData})
    const messages = encodeURIComponent('contact access was saved')
    console.log('contact access added')
    //res.json('Calendar access added')
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
}