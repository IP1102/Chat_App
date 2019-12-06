//console.log(__dirname + '/../public');
const path = require('path');
const publicPath = path.join(__dirname ,'../public');
//console.log(publicPath);
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


    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to ChatApp',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New User Joined',
        createdAt: new Date().getTime()
    })

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);

        io.emit('newMessage', {
            from : message.from,
            text: message.text,
            createdAt: new Date().getTime()

        }); 


        // socket.broadcast.emit('newMessage', {  //Emits to everyone except this one.
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    })


    socket.on('disconnect',() => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});





