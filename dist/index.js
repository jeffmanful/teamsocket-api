'use strict';

/**
 * A very simple barebone http express server
 * Get nodemon to watch changes.
 * 
 * Need to find out what we can store in these sockets.
 */
var app = require('express')();
var http = require('http').Server(app);
// init new intance by passing in the http server
var io = require('socket.io')(http);
var PORT = 4000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// TODO persist to db
// Global references
var users = [];
var connections = [];
var rooms = [];
var userRooms = {};

// this is the entry point for all connections on the default namespace
io.on('connection', function (socket) {
    connections.push(socket);

    console.log('Connected: %s sockets connected', connections.length);
    console.log(io.sockets.adapter.rooms);

    // new room
    socket.on('new room', function (data) {
        var host = void 0;
        socket.room = data.room;
        userRooms[socket.id];

        // does the room exist already on io.sockets?
        if (io.sockets.adapter.rooms[room] === undefined) {
            socket.send(socket.id);
            // if not then make this socket the host
            host = socket.id;
            init = true;
        } else {
            host = io.sockets.adapter.rooms[room].host;
        }

        // add the room to the global array
        if (!rooms.includes(socket.room)) {
            rooms.push(socket.room);
        }

        socket.join(data.room);
        console.log(socket.username + " connected to " + socket.room);
    });

    socket.on('join room', function (data) {
        // connect this socket to a room
        socket.join(data.room);

        // add this user to socket users
        io.sockets.adapter.rooms[room].users.push(data.username);
        // add to rooms hash
        userRooms[data.room].users.push(data.username);
    });

    socket.on('leave room', function (data) {
        // leave the socket
        socket.leave(data.room);
    });

    // new user connecting to the socket
    socket.on('new user', function (data) {
        socket.username = data;
        users.push(socket.username);
    });

    // socket sending a message
    socket.on('send message', function (data) {
        var message = data.message;

        io.sockets.in(data.room || '/').emit('new message', {
            message: message,
            user: socket.username
        });
    });

    socket.on('removeUserFromRoom', function (room, userId) {
        io.sockets.in(room).emit('userLeftRoom', userId);

        socket.leave(room);

        return data;
    });

    socket.on('userLeftRoom', function (userId) {
        return userId;
    });

    socket.on('userJoinedRoom', function (data) {
        io.sockets.in(data.roomName).emit(data.username);
        return data.username;
    });

    socket.on('userCreatedRoom', function (data) {
        io.sockets.in(data.roomName).emit(data.username + ' has created the room');
    });

    // Player
    socket.on('playVideo', function (data) {
        io.sockets.in(data.roomName.emit('playVideoClient'));
    });

    socket.on('pauseVideo', function (data) {
        io.sockets.in(data.roomName.emit('pauseVideoClient'));
    });

    socket.on('stopVideo', function (data) {
        io.sockets.in(data.roomName.emit('stopVideoClient'));
    });

    socket.on('seekVideo', function (data) {
        io.sockets.in(data.roomName.emit('seekVideoClient', data.seekValue));
    });

    socket.on('syncVideo', function (data) {
        io.sockets.in(data.roomName.emit('syncVideoClient', data));
    });

    socket.on('disconnect', function () {
        console.log('user disconnected', socket.id);
        // if username is found remove
        if (users.indexOf(socket.username) != -1) {
            users.splice(users.indexOf(socket.username), 1);
        }
    });

    socket.on('getRoomMembers', function (data) {
        var roomToFind = rooms.find(function (room) {
            return room.name === data.roomName;
        });
        var socketRoomToFind = socket.rooms.find(function (room) {
            return room.Name = data.roomName;
        });
        var members = roomToFind.members;


        socket.emit('recieveRoomMembers', members);
    });

    socket.on('rooms', function () {
        socket.emit('rooms', rooms);
    });

    socket.on('room', function (data) {
        // we should use the room id
        var roomToFind = rooms.find(function (room) {
            return room.roomName === data.roomName;
        });
    });

    function updateUsernames() {}
});

http.listen(PORT, function () {
    console.log('listening on port:' + PORT + '!');
});