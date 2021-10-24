const { Schema, model } = require('mongoose')

const Purchase = new Schema({
  purchase_type: { type: String },
  order_id: { type: String },
  cash_box: { type: String },
  payment_method: { type: String },
  card_type: { type: String },
  room: { type: String },
  service_type: { type: String },
  service_name: { type: String },
  price: { type: Number },
  price_final: { type: Number },
  discount: { type: String },
  discount_rationale: { type: String },
  discount_rationale_text: { type: String },
  alcohol_name: { type: String },
  date: {type: Date, default: Date.now},

  order: { ref: 'Order', type: Schema.Types.ObjectId },
  created_by: {ref: 'User', type: Schema.Types.ObjectId}
})

module.exports = model('Purchase', Purchase)
