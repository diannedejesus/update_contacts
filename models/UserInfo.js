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
  calendarEmail: {
    type: String,
    unique: false,
  },
  calendarPassword: {
    type: String,
    required: false,
  },
})

module.exports = mongoose.model('UserInfo', UserInfoSchema)
