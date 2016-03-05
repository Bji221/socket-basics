var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//sends currentusers to proivided socket
function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];
	var users = [];

	if(typeof info === 'undefined'){
		return;
	} 

	Object.keys(clientInfo).forEach( function (socketId){
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room){
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current Users: '+ users.join(', '),
		timeStamp: moment().valueOf()

	});
}


io.on('connection', function(socket) {
	console.log('User connected via socket.io');

	socket.on('disconnect', function (){
		var userData = clientInfo[socket.id]
		if (typeof userData !== 'undefined') {

			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text : userData.name + ' has left!',
				timeStamp : moment().valueOf()
			});
			delete clientInfo[socket.id];

		} 
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;

		socket.join(req.room);

		socket.broadcast.to(req.room).emit('message', {
			name: 'system',
			text: req.name + ' has Joined!',
			rimeStamp: moment().valueOf()

		});


	});

	//event - emits an event - name and data to send

	socket.on('message', function(message) {
		console.log('Message Received  :' + message.text + ' by ' + message.name);
		
		if(message.text === '@currentusers'){
			sendCurrentUsers(socket);
		} else {
			//broadcast message to everybody but the sender

		message.timeStamp = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message', message);

		}
	});


	//system message
	socket.emit('message', {
		name: 'System',
		text: 'welcome to the Bchat',
		timeStamp: moment().valueOf()
	});



});

http.listen(PORT, function() {
	console.log('Server started');
})