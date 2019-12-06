var socket = io();

socket.on('connect',function () {
console.log('User was Connected');
});

socket.on('disconnect',function ()  {
console.log('User was Connected');
});

socket.on('newMessage', function (message) {
    console.log('newMessage',message);
}); 
 
