const validator = require('validator');
const passport = require('passport');
const crypto = require ("crypto");
const User = require('../models/UserInfo');
const HistoricImportDB = require('../models/HistoricImport')

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
        res.redirect(req.session.returnTo || '/setDates')
      })
    })(req, res, next)
  },

  getConfigure: async (req, res) => {
    //allow for removal of credentials
    //implement flash for errors

    const dataCount = await HistoricImportDB.count()

    res.render('configure', { dataCount, accountName: req.user.calendarEmail });
  },

  editList: async (req, res) => {
    //allow for removal of credentials
    //implement flash for errors

    const allContacts = await HistoricImportDB.find()
    res.render('import_database', { allContacts });
  },

  toggleContact: async (req, res) => {
      const contactState = await HistoricImportDB.find({accessLink: req.query.accessLink}, 'disabled')

      await HistoricImportDB.findOneAndUpdate({accessLink: req.query.accessLink}, {disabled: !contactState[0].disabled})

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

    console.log('Calendar access added')
    res.json('Calendar access added')
  }
}