const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { jwt_secret } = require('../config/keys')

function generateAccessToken ( id, role, username, fullname ) {
  const payload = {
    id,
    role,
    username,
    fullname
  }
  return jwt.sign(payload, jwt_secret, { expiresIn: 60 * 60 * 24 })
}

class AuthController {
  async registration ( req, res ) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Ошибка регистрации.',
          errors
        })
      }
      const {
        username,
        password,
        fullname
      } = req.body
      const candidate = await User.findOne({ username })
      if (candidate) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует.' })
      }
      const salt = bcrypt.genSaltSync(10)
      const hashPassword = bcrypt.hashSync(password, salt)
      const userRole = await Role.findOne({ value: 'USER' })
      const user = await User.create({
        username,
        password: hashPassword,
        fullname,
        role: [ userRole.value ]
      })
      return res.status(200).json(user)

    } catch ( e ) {
      console.log(e.message)
    }
  }

  // LOGIN
  async login ( req, res ) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Ошибка авторизации.',
          errors
        })
      }

      const {
        username,
        password
      } = req.body

      const user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ message: `Пользователь ${ username } не найден` })
      }

      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ message: `Некорректный пароль.` })
      }

      const token = generateAccessToken(user._id, user.role, user.username, user.fullname)
      const userSendData = {
        username: user.username,
        role: user.role,
        fullname: user.fullname
      }
      return res.status(200).json({
        token: `Bearer ${ token }`,
        user: userSendData
      })

    } catch ( e ) {
      console.log(e.message)
    }
  }

  async getAllUsers ( req, res ) {
    try {
      const users = await User.find().select('username role fullname')
      res.json(users)

    } catch ( e ) {
      console.log(e.message)
    }
  }

  async getAuth ( req, res ) {
    try {
      res.status(200).json(req.user)
    } catch ( e ) {
      console.log(e.message)
    }
  }

  async getUser ( req, res ) {
    try {
      const name = req.params.username
      // console.log(name)
      const user = await User.findOne({ username: name }).select('_id username fullname role')
      const roles = await Role.find()
      // console.log(user)
      res.status(200).json({ user, roles })
    } catch ( e ) {
      console.log(e.message)
    }
  }

}

module.exports = new AuthController()
