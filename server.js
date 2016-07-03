var PORT = process.env.PORT || '3000';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
app.use(express.static(__dirname + '/public'));
var clientInfos = {};
io.on('connection', function(socket) {
	console.log('User connected via socket io');
	socket.on('joinRoom', function(req) {
		clientInfos[socket.id] = req;
		console.log('req', req);
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			date: moment().local().format('LTS')
		});
	});

	socket.on('message', function(message) {
		console.log('Received message :', message);
		/*socket.broadcast.emit('message', message);*/
		message.date = moment().local().format('LTS');
		io.to(clientInfos[socket.id].room).emit('message', message);

	});
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application',
		date: moment().local().format('LTS')

	});
});

http.listen(PORT, function() {
	console.log('Server started');
})