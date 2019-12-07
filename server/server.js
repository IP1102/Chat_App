//console.log(__dirname + '/../public');
const path = require('path');
const publicPath = path.join(__dirname ,'../public');
//console.log(publicPath);
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');

const express = require('express');
const port = process.env.PORT || 3000;
const http = require('http');
const socketIO = require('socket.io');

var app = express();
var server = http.createServer(app); //express implicitly invokes this in app.listen
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath)); //Serve static files

io.on('connection', (socket) => {
    console.log('New User Connected');


    // socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

    // socket.broadcast.emit('newMessage', generateMessage('Admin','New User joined'));

    socket.on('join', (params,callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
           return callback('Name and room name are required');
        }

        socket.join(params.room);
        //socket.leave('The Office Fans'/params.room)

        //io.emit -> io.to('The Office Fans')
        //socket.broadcast.emit -> socket.broadcasst.to('The Office Fans').emit ->TO all except this user
        //socket.emit
        users.removeUser(socket.id); //To remove same users
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`));

        callback();
    });

    socket.on('createMessage', (message,callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from,message.text)); 
        callback(); //Acknowledgement

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
        //console.log('User was disconnected');
        var user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left`));
        }


    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});





