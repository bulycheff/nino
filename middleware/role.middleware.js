const { jwt_secret } = require('../config/keys')
const jwt = require('jsonwebtoken')

module.exports = ( roles ) => {
  return function ( req, res, next ) {
    if (req.method === 'OPTIONS') {
      next()
    }

    try {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return res.status(403).json({ message: 'Пользователь не авторизован' })
      }
      const decodedData = jwt.verify(token, jwt_secret)
      const userRoles = decodedData.role

      let hasRole = false
      userRoles.forEach(role => {
        if (roles.includes(role)) {
          hasRole = true
        }
      })

      if (!hasRole) {
        return res.status(403).json('Нет прав на просмотр')
      }

      next()
    } catch ( e ) {
      console.log(e.message)
    }
  }
}
