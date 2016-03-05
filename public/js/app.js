var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

var socket = io();



socket.on('connect', function(){
	console.log('connected to server');
});

socket.on('message', function(message){
	var momentTimeStamp = moment.utc(message.timeStamp);
	var $message = jQuery('.messages');
	console.log('new Message:');
	console.log(message.text);

	// . for classes , id - #. tagname - just the tag name
	
	$message.append('<p><strong>'+ message.name + ', '+momentTimeStamp.local().format('h:mm a') +':  </strong>'+ message.text +'</p>');

});

// Handles submitting of new messages!
//selects all the message-form #-id elements
var $form = jQuery('#message-form');

//submit event - all browsers knows about it
$form.on('submit', function (event){
	//prevenDefault prevents the old-fashioned way!
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		
		name: name,
		text: $message.val()


	});

	$message.val('');


});
