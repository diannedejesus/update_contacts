//const { text } = require('express')
const mongoose = require('mongoose')

const UserInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  calendarPassword: {
    type: String,
    required: false,
  },
  calendarEmail: {
    type: String,
    required: false,
  },
})

module.exports = mongoose.model('UserInfo', UserInfoSchema)
