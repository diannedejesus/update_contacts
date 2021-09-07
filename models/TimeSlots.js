const mongoose = require('mongoose')

const TimeSlotSchema = new mongoose.Schema({
  selectedSlot: {
    type: Date,
    default: ''
  },
  slotChoices: {
    type: Array,
    required: true,
  },
  linkId: {
    type: String,
    required: true, 
  }
})

module.exports = mongoose.model('TimeSlots', TimeSlotSchema)
