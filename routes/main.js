const express = require('express')
const router = express.Router()
const contactController = require('../controllers/main')
const {ensureAuth, ensureGuest} = require('../middleware/auth');


router.get('/', ensureAuth, contactController.index)
router.get('/import', ensureAuth, contactController.import)
router.get('/fill', ensureAuth, contactController.fillReference)
router.get('/compare', ensureAuth, contactController.compareData)
router.get('/compare/:id', ensureAuth, contactController.compareData)


module.exports = router