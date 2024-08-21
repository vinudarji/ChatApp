const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Store connected users
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Event: User joins chat
  socket.on('joinChat', (user) => {
    console.log(socket.id, user);
    
    if (checkCurrentUsers(user, socket.id))
    {
      connectedUsers[socket.id] = user;
      io.emit('updateUserList', Object.values(connectedUsers));
    }
  });

  // Event: New message
  // Change this part in server.js

// Change this part in server.js

// Event: New message
socket.on('newMessage', (data) => {
    const { sender, recipient, message } = data;
    console.log(connectedUsers);
    // Send the private message to the recipient
    const recipientSocket = Object.keys(connectedUsers).find(
      (socketId) => connectedUsers[socketId].id === recipient
    );
        console.log('Server message:',recipientSocket);
    if (recipientSocket) {
      io.to(recipientSocket).emit('privateMessage', { sender, message });
    }
  });
  
  

  // Event: User disconnected
  socket.on('disconnect', () => {
    delete connectedUsers[socket.id];
    io.emit('updateUserList', Object.values(connectedUsers));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function checkCurrentUsers(user, recipientSocket)
    {
      console.log(1)
      var onlineUsers = Object.values(connectedUsers);
      if (onlineUsers != undefined)
      {
        console.log(onlineUsers.map(obj => obj.UserName).join(', '))
        var userExists = onlineUsers.some(obj => obj.UserName === user.UserName);
        if (userExists)
        {
          console.log(123)
          io.to(recipientSocket).emit('duplicateUserName', user.UserName + ' already exists');
          return false;
        }
        return true;
      }
      else{
        console.log(111)
        return true;
      }
    }
