const mongoose = require('mongoose')

const NameReferenceSchema = new mongoose.Schema({
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
  
  accessLink: {
    type: String,
    required: true,
    unique: true,
  },
  accessCount: {
    type: Number,
  },
  submittedCount: {
    type: Number,
  }
})

module.exports = mongoose.model('NameReference', NameReferenceSchema)
