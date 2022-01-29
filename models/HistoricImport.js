const mongoose = require('mongoose')

const HistoricImportSchema = new mongoose.Schema({
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
    default: true,
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

  disabled: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('HistoricImport', HistoricImportSchema)
