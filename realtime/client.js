/* Connection with socketio client */
const io = require('socket.io-client')

//URL to connect
let socket = io.connect('http://localhost:3000',{reconnect: true})

//Socket connected, show console message
socket.on('connect', function () {
	console.log("\n\nSocket connected from NodeJS\n\n")
})

module.exports = socket