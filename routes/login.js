const express = require('express') 
const passport = require('passport')
const router = express.Router()
const loginCont = require('../controllers/loginCont');
const {ensureAuth, ensureGuest} = require('../middleware/auth');

router.get('/', loginCont.getPage);
router.post('/', loginCont.postLogin);

router.get('/configure', ensureAuth, loginCont.getConfigure);
router.post('/configure', ensureAuth, loginCont.submitCredentials);

router.get('/editList', ensureAuth, loginCont.editList);
router.get('/toggleContact', ensureAuth, loginCont.toggleContact);

module.exports = router
 