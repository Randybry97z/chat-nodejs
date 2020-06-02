const express = require('express')

let ConversationsController = require('../controllers/conversations')
let router = express.Router()


router.route('/chats').get(ConversationsController.index).post(ConversationsController.create)

router.get('/chats/new',ConversationsController.new)

router.get('/chats/:id',ConversationsController.show)

module.exports = router