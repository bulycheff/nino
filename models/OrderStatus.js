const { Schema, model } = require('mongoose')

const OrderStatus = new Schema({
  name: { type: String, unique: true }
})

module.exports = model('OrderStatus', OrderStatus)
