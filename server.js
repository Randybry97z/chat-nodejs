const express = require('express')
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const methodOverride = require('method-override')
const session = require('express-session')
const socketio = require('socket.io');
const app = express()

const chatRoutes = require('./routes/chats_routes')
const registrationRoutes = require('./routes/registration_routes')
const sessionRoutes = require('./routes/sessions_routes')

const findUserMiddleware = require('./middlewares/find_user')
const authUserMiddleware = require('./middlewares/auth_user')

app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.set('view engine', 'pug')

app.use('/public', express.static('assets', {
	etag: false,
	maxAge: '24h'  //Max age for cache
}))

app.use(session({
	secret: ['2312njwenrwjerw','12312ewdwifjsdfsd'],
	saveUninitialized: false,
	resave: false
}))

app.use(findUserMiddleware)
app.use(authUserMiddleware)

app.use(chatRoutes)
app.use(registrationRoutes)
app.use(sessionRoutes)

const User = require('./models').User

app.get('/', function (req,res) {
	User.findAll().then((users)=>{
		res.render('home',{user: req.user, users})
	})
})


let server = app.listen(3000, function() {
	console.log('App escuchando en el puerto 3000')
})

let io = socketio(server)
let sockets = {}

let usersCount = 0;
io.on('connection', function (socket) {

	let userId = socket.request._query.loggeduser
	if (userId) sockets[userId] = socket
	//Actualiza usuarios conectados
	usersCount++;

	socket.on('new_message', function (data) {
		io.emit('new_message',data)
	})

	io.emit('count_updated',{count: usersCount})

	socket.on('disconnect', function () {
		//Eliminar socket conectada
		delete sockets[userId]

		usersCount--;
		io.emit('count_updated',{count: usersCount})
	})
})

const client = require('./realtime/client')