const { jwt_secret } = require('../config/keys')
const jwt = require('jsonwebtoken')

module.exports = ( req, res, next ) => {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
      return res.status(403).json({ message: 'Пользователь не авторизован' })
    }

    req.user = jwt.verify(token, jwt_secret)

    next()
  } catch ( e ) {
    return res.status(403).json({ error: 'Нет прав на просмотр' })
  }
}
