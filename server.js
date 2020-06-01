const express = require('express')
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const methodOverride = require('method-override')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.set('view engine', 'pug')

app.use('/public', express.static('assets', {
	etag: false,
	maxAge: '24h'  //Max age for cache
}))

app.use('/', function (req,res) {
	res.render('home')
})


app.listen(3000, function (err) {
	if (err) return console.log('Hubo un error en el proceso'),process.exit(1)
	console.log('App escuchando en el puerto 3000')
})