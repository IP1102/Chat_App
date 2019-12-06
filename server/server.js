//console.log(__dirname + '/../public');
const path = require('path');
const publicPath = path.join(__dirname ,'../public');
//console.log(publicPath);
const {generateMessage, generateLocationMessage} = require('./utils/message');
const express = require('express');
const port = process.env.PORT || 3000;
const http = require('http');
const socketIO = require('socket.io');

var app = express();
var server = http.createServer(app); //express implicitly invokes this in app.listen
var io = socketIO(server);


app.use(express.static(publicPath)); //Serve static files

io.on('connection', (socket) => {
    console.log('New User Connected');


    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin','New User joined'));

    socket.on('createMessage', (message,callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from,message.text)); 
        callback('This is from server'); //Acknowledgement

        // socket.broadcast.emit('newMessage', {  //Emits to everyone except this one.
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });


    socket.on('createLocationMessage', (coords) => {
        // io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    })

    socket.on('disconnect',() => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});





