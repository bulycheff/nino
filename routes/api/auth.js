const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const authController = require('../../controllers/auth.controller')
const roleMiddleware = require('../../middleware/role.middleware')
const authMiddleware = require('../../middleware/auth.middleware')

router.post('/login',[
  check('username', 'Имя пользователя не может быть пустым').notEmpty(),
  check('password', 'Пароль должен быть от 4 до 10 символов.').isLength({min: 4, max: 10})
], authController.login)

router.post('/registration', [
  check('username', 'Имя пользователя не может быть пустым').notEmpty(),
  check('password', 'Пароль должен быть от 4 до 10 символов.').isLength({min: 4, max: 10})
], authMiddleware, roleMiddleware(['ADMIN']), authController.registration)

router.get('/users', authMiddleware, roleMiddleware(['ADMIN']),  authController.getAllUsers)
router.get('/user/:username', authMiddleware, roleMiddleware(['ADMIN']),  authController.getUser)
router.get('/status', authMiddleware,  authController.getAuth)

module.exports = router
