var socket = io();

socket.on('connect', function(){
	console.log('connected to server');
});

socket.on('message', function(message){
	var momentTimeStamp = moment.utc(message.timeStamp);
	console.log('new Message:');
	console.log(message.text);

	// . for classes , id - #. tagname - just the tag name
	
	jQuery('.messages').append('<p><strong>'+ momentTimeStamp.local().format('h:mm a') +':  </strong>'+ message.text +'</p>');

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
		text: $message.val()
	});

	$message.val('');


});
