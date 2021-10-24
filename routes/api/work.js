const { Router } = require('express')
const router = Router()

const workController = require('../../controllers/work.controller')
const roleMiddleware = require('../../middleware/role.middleware')
const authMiddleware = require('../../middleware/auth.middleware')

// рабочие смены
router.post('/day/create', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.createDay)
router.patch('/day/close/:id', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.closeDay)
router.get('/day/:id', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.getDay)
router.get('/days', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.allDays)
router.get('/days/active', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.allDaysOpen)
router.get('/days-filter', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.allDaysFilter)

// заказы (они же клиенты)
router.post('/order/new', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.newOrder)
router.get('/order/all', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.allOrders)
router.get('/order', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.orderById)
router.patch('/order/close/:id', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.closeOrder)

// покупки добавленные в заказы
router.post('/purchase/new', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.newPurchase)
router.get('/purchase/all', authMiddleware, roleMiddleware(['USER', 'ADMIN']), workController.AllPurchases)


module.exports = router
