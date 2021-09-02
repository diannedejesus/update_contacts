const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  dateTime: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('appointments', appointmentSchema)
