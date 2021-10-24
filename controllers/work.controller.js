const errorHandler = require('../utils/errorHandler')
const User = require('../models/User')
const Role = require('../models/Role')
const Day = require('../models/Day')
const Order = require('../models/Order')
const Purchase = require('../models/Purchase')
const DayStatus = require('../models/DayStatus')
const OrderStatus = require('../models/OrderStatus')
const mongoose = require('mongoose')
const { Schema } = require('mongoose')

class WorkController {

  async createDay ( req, res ) {
    try {
      console.log(req.user.id)
      const day = await Day.create({ 'opened_by': req.user.id })
      day.save()
      res.json(day)
      res.status(200)
    } catch ( e ) {
      errorHandler(res, e)
    }
  }

  async closeDay ( req, res ) {
    try {
      // console.log(req.user)
      await Day.findByIdAndUpdate(req.params.id, { $set: { status: 'closed', closed_by: req.user.id, finish: Date.now() } }, { new: true })
      const days = await Day.find({ status: 'active', opened_by: req.user.id })
      res.status(200).json(days)
    } catch ( e ) {
      errorHandler(res, e)
    }
  }

  async getDay ( req, res ) {
    try {
      const day = await Day.findById(req.params.id)
      res.status(200).json(day)
    } catch ( e ) {
      errorHandler(res, e)
    }
  }

  async allDays ( req, res ) {

    try {
      const days = await Day.find({})
      res.status(200).json(await days)

    } catch ( e ) {
      errorHandler(res, e)
    }
  }

  async allDaysOpen ( req, res ) {

    try {
      const days = await Day.find({ status: 'active', opened_by: req.user.id })
      res.status(200).json(await days)

    } catch ( e ) {
      errorHandler(res, e)
    }
  }

  async allDaysFilter ( req, res ) {

    const { start, finish } = req.query
    const startDate = start ? new Date(start.substr(0, 4), start.substr(4, 2) - 1, start.substr(6, 2)) : null

    startDate.setHours(startDate.getHours() + 5)

    try {
      if (!start || !finish) {
        const days = await Day.find({})
        res.status(200).json(await days)
      } else {

      }

    } catch ( e ) {
      errorHandler(res, e)
    }
  }

  async newOrder ( req, res ) {
    const {id: user_id} = req.user
    const {day_id, client_name, from_where, is_new} = req.query
    if (!day_id) {
      return res.status(400).json({message: 'Идентификатор смены (day_id) должен содержаться в строке запроса'})
    } else {
      try {
        const newOrder = await Order.create({
          opened_by: mongoose.Types.ObjectId(user_id),
          day: mongoose.Types.ObjectId(day_id),
          name: client_name,
          from_where,
          is_new
        })
        res.status(200).json({newOrder})
        // console.log(day.opened_by.equals(user_id))
      } catch ( e ) {
        errorHandler(res, e)
      }
    }
  }

  async allOrders ( req, res ) {
    const {id: user_id} = req.user
    const {day_id} = req.query
    try {
      const allOrders = await Order.find({
        opened_by: mongoose.Types.ObjectId(user_id),
        day: mongoose.Types.ObjectId(day_id)})
      res.status(200).json(allOrders)
    } catch ( e ) {
      errorHandler(res, e)
    }

  }

  async orderById ( req, res ) {
    const {id} = req.query
    if(id) {
      try {
        const order = await Order.findById(id)
        res.status(200).json(order)
      } catch ( e ) {
        errorHandler(res, e)
      }
    }
  }

  async closeOrder ( req, res ) {
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, {
        $set: {
          status: 'closed',
          closed_by: req.user.id,
          finish: Date.now()
        }
      }, {new: true})
      res.status(200).json(order)

    } catch ( e ) {
      errorHandler(res, e)
    }

  }

  // ------------------------ПОКУПКИ---------------------------

  async newPurchase ( req, res ) {
    try {
      const response = req.body
      const orderId = response.order
      response.created_by = mongoose.Types.ObjectId(req.user.id)
      response.order = mongoose.Types.ObjectId(orderId)
      const newPurchase = await Purchase.create(response)
      newPurchase.save()
      res.status(200).json(newPurchase)

    } catch ( e ) {
      errorHandler(res, e)
    }

  }

  async AllPurchases ( req, res ) {
    try {
      const { order_id } = req.query
      // response.closed_by = req.user.id
      console.log(order_id)
      const allPurchasesByOrderId = await Purchase.find({order: mongoose.Types.ObjectId(order_id)})
      res.status(200).json(allPurchasesByOrderId)

    } catch ( e ) {
      errorHandler(res, e)
    }

  }

}

module.exports = new WorkController()
