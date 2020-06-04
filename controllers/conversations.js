const Chat = require('../models').Chat
const User = require('../models').User

module.exports = {
	index: function (req,res) {
		Chat.findAll().then((chats)=>{
			res.render('chats/index',{chats: req.user.chats})
		})
	},
	show: function (req,res) {
		Chat.findByPk(req.params.id,{
			include: [
				{
					model: User,
					as: 'user'
				},
			]
		}).then(function (chat) {
			res.render('chats/show', {chat})
		})
	},
	delete: function (req,res) {
	 	Chat.destroy({
	 		where: {},
	 		truncate: true
	 	}).then((response)=>{
	 		console.log('Chats eliminados')
	 	})
	},
	create: function (req,res) {
		Chat.create({
			body: req.body.body,
			user_b: req.user.nickname,
			userId: req.user.id
		}).then(result=>{

		}).catch(err=>{
			console.log(err)
			res.json(err)
		})
	},
	new: function(req,res){
		res.render('chats/new')
	}
}