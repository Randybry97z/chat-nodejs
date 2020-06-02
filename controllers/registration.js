const User = require('../models').User

module.exports = {
	new: function(req,res){
		res.render('registrations/new')
	},
	create: function (req,res) {
		let data = {
			email: req.body.email,
			password: req.body.password,
			nickname: req.body.nickname
		}
		User.create(data).then(result=>{
			res.json(result)
			console.log(result)
		}).catch(err=>{
			res.json(err)
			console.log(err)
		})
	}
}