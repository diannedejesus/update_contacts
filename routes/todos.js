const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/todos')

router.get('/', bookingController.setDates)

router.get('/selectTimeSlot', bookingController.selectTimeSlots)
router.get('/selectTimeSlot/:id', bookingController.selectTimeSlots)

router.post('/createTimeSlot', bookingController.createTimeSlot)

router.post('/assignTimeSlot', bookingController.assignTimeSlot)

router.put('/markComplete', bookingController.markComplete)

router.put('/markIncomplete', bookingController.markIncomplete)

router.delete('/deleteDates', bookingController.deleteDates)

module.exports = router