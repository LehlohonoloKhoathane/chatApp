const express = require("express");                             //import express
const path = require("path");                                   //import path
const app = express();                                          // create an instance of the Express application
const server = require("http").createServer(app);               //creates an HTTP server using Node.js's built-in http module
const io = require("socket.io")(server);                        //initialize Socket.IO and passes the server instance as an argument

app.use(express.static(path.join(__dirname+"/public")));        //sets up a middleware using app.use
io.on("connection", function(socket){                           // setting up event listeners for the Socket.IO server
    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username + " " + " Joined the conversation.");
    });
    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + " " +" left the conversation.");
    });
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
})

server.listen(5000)                       //listen on port 5000
