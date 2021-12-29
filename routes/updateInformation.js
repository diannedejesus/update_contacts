const express = require('express')
const router = express.Router()
const updateInformationController = require('../controllers/updateInformationCtrler')
const {ensureAuth, ensureGuest} = require('../middleware/auth');


router.get('/', ensureAuth, updateInformationController.index)
router.get('/:id', ensureAuth, updateInformationController.index)
router.post('/', ensureAuth, updateInformationController.submitInfo)

// //router.get('/receiptPage', ensureAuth, bookingController.receiptPage)




module.exports = router