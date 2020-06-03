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

app.get('/', function (req,res) {
	res.render('home',{user: req.user})
	//console.log(req.user)
})


let server = app.listen(3000, function (err) {
	if (err) return console.log('Hubo un error en el proceso'),process.exit(1)
	console.log('App escuchando en el puerto 3000')
})

let io = socketio(server)
let sockets = {}

let usersCount = 0;
io.on('connection', function (socket) {

	let userId = socket.request._query.loggeduser
	if (userId) sockets[userId] = socket
	console.log(sockets)
	//Actualiza usuarios conectados
	usersCount++;

	io.emit('count_updated',{count: usersCount})

	socket.on('new_message', function (data) {
		if (data.userId) {
			let userSocket = sockets[data.userId]
			if (!userSocket) return

			userSocket.emit('new_message',data)
		}
		io.emit('new_message',data)
	})

	socket.on('disconnect', function () {

		//Eliminar socket conectada
		Object.keys(sockets).forEach(userId=> {
			let s= sockets[userId]
			if (s.id == socket.id) sockets[userId] = null
		});

		console.log(sockets)

		usersCount--;
		io.emit('count_updated',{count: usersCount})
	})
})

const client = require('./realtime/client')