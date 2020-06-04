const User = require('../models').User

module.exports = {
	new: function(req,res){
		res.render('registrations/new')
	},
	create: function (req,res) {
		let image= req.files.avatar
		let filename = image.name
		image.mv('./assets/img/'+filename,function (err) {
			if (err)
				console.log(err)

		})
		let data = {
			email: req.body.email,
			password: req.body.password,
			nickname: req.body.nickname,
			avatar: (req.files.avatar) ? filename : 'users.svg'
		}
		User.create(data).then(result=>{
			res.json(result)
			console.log(result)
		}).catch(err=>{
			res.json(err)
			console.log(err)
		})
	},
	delete: function (req,res) {
		User.destroy({
			where: {},
			truncate: true
		}).then((response) =>{
			console.log('Ususarios eliminados')
		})
	}
}