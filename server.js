var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket){ 
	console.log('User connected via socket.io');

	//event - emits an event - name and data to send
	
	socket.on('message', function(message){
		console.log('Message Received  :' + message.text);
		//broadcast message to everybody but the sender
		message.timeStamp = moment().valueOf();
		io.emit('message', message);

	});


	//system message
	socket.emit('message', {
		text : 'welcome to the Bchat',
		timeStamp: moment.valueOf()
	});



});

http.listen(PORT, function(){
	console.log('Server started');
})