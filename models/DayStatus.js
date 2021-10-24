const { Schema, model } = require('mongoose')

const DayStatus = new Schema({
  name: { type: String, unique: true }
})

module.exports = model('DayStatus', DayStatus)
