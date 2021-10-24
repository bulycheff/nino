const { Schema, model } = require('mongoose')

const Day = new Schema({
  start: { type: Date, default: Date.now },
  finish: { type: Date, default: null },
  status: {ref: 'DayStatus', type: String, default: 'active'},
  opened_by: { ref: 'User', type: Schema.Types.ObjectId, required: true },
  closed_by: { ref: 'User', type: Schema.Types.ObjectId },
  orders: [{ ref: 'Order', type: Schema.Types.ObjectId }]
})

module.exports = model('Day', Day)
