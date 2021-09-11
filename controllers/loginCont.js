const validator = require('validator');
const passport = require('passport');
const User = require('../models/UserInfo');

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
  }
}