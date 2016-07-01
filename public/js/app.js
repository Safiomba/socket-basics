var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
console.log(name + ' wants to join ' + room);
socket.on('connect', function() {
	console.log('Connected to socket.io server');
});
socket.on('message', function(message) {
	console.log('New message :', message.text);
	var $message = jQuery('.messages');
	$message.append('<p><strong>' + 
		message.name + ' ' +
		message.date + '</strong></p>');
	$message.append('<p>' +
		message.text + '</p>');

});
// Handling submitting a new form input
var $form = jQuery('#message-form');
$form.on('submit', function(event) {
	event.preventDefault();
	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		name: name,
		text: $message.val()
	});
	$message.val('');

});