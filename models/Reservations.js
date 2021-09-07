const { text } = require('express')
const mongoose = require('mongoose')



const ReservationSchema = new mongoose.Schema({
  linkId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  subject: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
})

module.exports = mongoose.model('Reservation', ReservationSchema)
