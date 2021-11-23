const { text } = require('express')
const mongoose = require('mongoose')



const SubmittedInformationSchema = new mongoose.Schema({
  name: {
    firstName: {
      type: String,
      requiered: true,
    },
    middleInitial: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      requiered: true,
    },
  },

  phones: [{
    number: String,
    numberType: String,
  }],

  email: {
    type: String,
  },
  emailUsee: {
    type: Boolean,
  },

  address: {
    street: String,
    city: String,
    state: String,
    zipcode: String,
  },
  accessLink: {
    type: String,
    unique: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  syncedDate: {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model('SubmittedInformation', SubmittedInformationSchema)
