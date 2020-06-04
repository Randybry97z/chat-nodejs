const express = require('express')

let RegistrationsController = require('../controllers/registration')
let router = express.Router()


router.get('/signup', RegistrationsController.new)

router.route('/users').post(RegistrationsController.create)

router.route('/delete_users').get(RegistrationsController.index).delete(RegistrationsController.delete)

module.exports = router