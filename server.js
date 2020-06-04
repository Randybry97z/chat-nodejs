const express = require('express')
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const methodOverride = require('method-override')
const session = require('express-session')
const socketio = require('socket.io')
const fileUpload = require('express-fileupload')
const app = express()

const chatRoutes = require('./routes/chats_routes')
const registrationRoutes = require('./routes/registration_routes')
const sessionRoutes = require('./routes/sessions_routes')

const findUserMiddleware = require('./middlewares/find_user')
const authUserMiddleware = require('./middlewares/auth_user')

app.use(fileUpload())

app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.set('view engine', 'pug')

app.use('/public', express.static('assets', {
	etag: false,
	maxAge: '24h'  //Max age for cache
}))

let sessionConfig = {
	secret: ['2312njwenrwjerw','12312ewdwifjsdfsd'],
	saveUninitialized: false,
	resave: false
}

if (process.env.NODE_ENV && process.env.NODE_ENV == 'production') {
	sessionConfig['store'] = new (require('connect-pg-simple')(session))()
}

app.use(session(sessionConfig))

app.use(findUserMiddleware)
app.use(authUserMiddleware)

app.use(chatRoutes)
app.use(registrationRoutes)
app.use(sessionRoutes)

const User = require('./models').User
const Chat = require('./models').Chat

app.get('/', function (req,res) {
	if (req.user) {
		User.findAll().then((users)=>{
			Chat.findAll().then((chats)=>{
				res.render('home',{user: req.user, users, chats})
			})
		})
	}
	else {
		res.redirect('/sessions')
	}
})

let server = app.listen(process.env.PORT || 3000, function() {
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