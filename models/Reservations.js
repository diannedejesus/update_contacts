const { text } = require('express')
const mongoose = require('mongoose')

const { nanoid } = require('nanoid')

const TodoSchema = new mongoose.Schema({
  dateTime: {
    type: Array,
    required: true,
  },
  linkId: {
    type: String,
    default: nanoid(),
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
  filled: {
    type: Boolean,
    required: true,
  }
})

module.exports = mongoose.model('Todo', TodoSchema)
