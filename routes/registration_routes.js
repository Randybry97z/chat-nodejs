const express = require('express')

let RegistrationsController = require('../controllers/registration')
let router = express.Router()


router.get('/signup', RegistrationsController.new)

router.route('/users').post(RegistrationsController.create)

module.exports = router