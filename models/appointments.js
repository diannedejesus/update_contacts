const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  dateTime: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  linkId: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('appointments', appointmentSchema)
