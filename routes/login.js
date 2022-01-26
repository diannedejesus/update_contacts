const express = require('express') 
const passport = require('passport')
const router = express.Router()
const loginCont = require('../controllers/loginCont');
const {ensureAuth, ensureGuest} = require('../middleware/auth');

router.get('/', loginCont.getPage);
router.post('/', loginCont.postLogin);

router.get('/configure', ensureAuth, loginCont.getConfigure);
router.post('/configure', ensureAuth, loginCont.submitCredentials);
router.post('/addContact', ensureAuth, loginCont.addContact);


router.get('/confirmDelete', ensureAuth, loginCont.verifyDeleteData)
router.get('/deleteData', ensureAuth, loginCont.deleteData)
router.get('/deleteCredentials', ensureAuth, loginCont.deleteCredentials)

router.get('/editList', ensureAuth, loginCont.editList);
router.get('/toggleContact', ensureAuth, loginCont.toggleContact);

module.exports = router
 