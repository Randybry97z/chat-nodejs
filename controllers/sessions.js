const User = require('../models').User

module.exports = {
	new: function (req,res) {
		res.render('sessions/new')
	},
	create: function (req,res) {
		User.login(req.body.nickname, req.body.password)
			.then(user => {
				if(user){
					req.session.userId = user.id
				}
				//res.json(user)
				res.redirect('/')
			})
			.catch(err => {
				console.log(err)
				res.json(err)
			})
	},
	// show: function (req,res) {
	// 	User.findAll().then((users)=>{
	// 		res.render('', {users})
	// 	})
	// },
	destroy: function (req,res) {
		req.session.destroy(function () {
			res.redirect('/sessions')
		})
	}
}