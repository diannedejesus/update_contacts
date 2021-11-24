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
  emailUse: {
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
  },

  timestamp: {
    type: Date,
    required: true,
  },
  syncedDate: {
    type: Date,
  },
})

module.exports = mongoose.model('SubmittedInformation', SubmittedInformationSchema)
