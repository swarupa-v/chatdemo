var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sqlHelper = require('./dbhelper');

let registeredRooms = ["Room1", "Room2", "Room3"]; 

app.get('/', function(req, res) {
    res.sendFile(__dirname +'/views' + '/home.html');
 });
 
 app.get('/message',function(req,res){
    res.sendFile(__dirname +'/views' + '/message.html');
  });

 var nsp = io.of('/my-namespace');
const newLocal = 'chatmessage';
 nsp.on('connection', function(socket) {
    console.log('someone connected');
    nsp.emit('hi', registeredRooms.toString() );

   console.log('join room');
    socket.on("joinroom",room=>{
        console.log("Joining Room...: " + room);
        if (registeredRooms.includes(room)) {
          //Socket has joined the request room
          
          socket.join(room);

          io.of("/my-namespace").in(room).emit("message", "New user has been connected to the " + room + " Room");
          return socket.emit("roomresult", "Valid Room Name: " + room);
        } else {
         //No room with the specified Name! (or it could be another reason).
         return socket.emit("roomerr", "Invalid Room Name: " + room);
        }        
    });

    console.log('chat message');
    socket.on('chatmessage', function (data) {
      console.log('chatmessage',data);
      io.of('/my-namespace').to(data.room).emit('messagebroadcast', data.message);

   }); 
 });

 var nsp1 = io.of('/my-namespace1');

 nsp1.on('connection', function(socket) {
    console.log('someone connected1');
    nsp1.emit('hi', registeredRooms.toString() );

   console.log('join room');
    socket.on("joinroom",room=>{
        console.log("Joining Room...: " + room);
        if (registeredRooms.includes(room)) {
          //Socket has joined the request room
          
          socket.join(room);

          io.of("/my-namespace1").in(room).emit("message", "New user has been connected to the " + room + " Room");
          return socket.emit("roomresult", "Valid Room Name: " + room);
        } else {
         //No room with the specified Name! (or it could be another reason).
         return socket.emit("roomerr", "Invalid Room Name: " + room);
        }        
    });

    console.log('chat message');
    socket.on('chatmessage', function (data) {
      console.log('chatmessage',data);
      io.of('/my-namespace1').to(data.room).emit('messagebroadcast', data.message);

   }); 
 });
 
 http.listen(3000, function() {
    console.log('listening on localhost:3000');
 });
