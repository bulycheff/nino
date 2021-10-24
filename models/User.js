const { Schema, model } = require('mongoose')

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String },
  role: [ { ref: 'Role', type: String } ]
})

module.exports = model('User', User)
