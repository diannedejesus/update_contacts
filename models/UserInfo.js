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
})

module.exports = mongoose.model('UserInfo', UserInfoSchema)
