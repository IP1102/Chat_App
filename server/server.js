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

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);

        io.emit('newMessage', {
            from : message.from,
            text: message.text,
            createdAt: new Date().getTime()

        }); 
    })


    socket.on('disconnect',() => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});





