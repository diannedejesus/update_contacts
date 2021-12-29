const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/main')
const {ensureAuth, ensureGuest} = require('../middleware/auth');


router.get('/', ensureAuth, bookingController.index)
router.get('/import', ensureAuth, bookingController.import)
router.get('/fill', ensureAuth, bookingController.fillReference)



module.exports = router