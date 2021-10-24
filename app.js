const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const authRouter = require('./routes/api/auth')
const workRouter = require('./routes/api/work')

const { mongo_uri } = require('./config/keys')

const app = express()
app.get('/api', ( req, res ) => {
  res.send({ message: 'Hello Express!' })
})

try {
  mongoose.connect(mongo_uri).then(() => console.log(`MongoDB successfully connected.`))
} catch ( e ) {
  console.log('MongoDB connection error:')
  console.log(e.message)
}

app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/api/auth', authRouter)
app.use('/api/work', workRouter)

module.exports = app
