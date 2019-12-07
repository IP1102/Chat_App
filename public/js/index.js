var socket = io();

socket.on('connect',function () {
console.log('User was Connected');
});

socket.on('disconnect',function ()  {
console.log('User was Disconnected');
});

socket.on('newMessage', function (message) {
    console.log('newMessage',message);
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
}); 


socket.on('newLocationMessage', function(message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target = "_blank">My Current Location</a>'); //target=_blank opens in a new tab

    li.text(`${message.from}: `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);

})


// socket.emit('createMessage', {
//     from:'Victor',
//     text: 'Hi',
// }, function(data) {
//     console.log('Got It',data);
// });

jQuery('#message-form').on('submit',function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function() {
        jQuery('[name=message]').val('')
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by browser');
    }

    locationButton.attr('disabled','disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(function (position){
       // console.log(position);
       locationButton.removeAttr('disabled').text('Send Location');
       socket.emit('createLocationMessage', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       })
    }, function (){
       locationButton.removeAttr('disabled').text('Send Location');
       locationButton.removeAttr('disabled').text('');
        return alert('Unable to fetch geolocation'); 

    })
});

