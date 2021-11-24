const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/main')
const {ensureAuth, ensureGuest} = require('../middleware/auth');

router.get('/', ensureAuth, bookingController.setDates)
router.get('/import', ensureAuth, bookingController.import)
router.get('/fill', ensureAuth, bookingController.fillReference)
router.get('/updateInfo', ensureAuth, bookingController.updateInfo)
router.get('/updateInfo/:id', ensureAuth, bookingController.updateInfo)
router.post('/updateInfo', ensureAuth, bookingController.submitInfo)

// router.post('/createTimeSlot', ensureAuth, bookingController.createTimeSlot)
// router.post('/resendEmail', ensureAuth, bookingController.resendEmail)

// router.put('/assignTimeSlot', bookingController.assignTimeSlot)

// router.delete('/deleteDates', bookingController.deleteDates)

module.exports = router