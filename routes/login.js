const express = require('express') //copied and pasted from microsoft nothing new needs to be changed
const passport = require('passport')
const router = express.Router()
const loginCont = require('../controllers/loginCont');
const {ensureAuth, ensureGuest} = require('../middleware/auth');

router.get('/', loginCont.getPage);
router.post('/', loginCont.postLogin);
router.get('/configure', loginCont.getConfigureCalendar);
router.post('/configure', loginCont.configureCalendar);

module.exports = router
 