const express = require('express');
const path = require('path');
const socket = require('socket.io');

let messages = require('./messages');
let users = require('./users');

const app = express();

app.use(express.static(path.join(__dirname, '/client/')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

const myserv = app.listen(8000, () => {
  console.log('myserv is running on port: 8000');
});

const io = socket(myserv);

io.on('connection', (socket) => {
  socket.on('join', (userName) => {
    const user = { name: userName, id: socket.id }
    users.push(user);
  })

  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });  

  socket.on('disconnect', () => {
    if (users.length > 0) {
      users = users.filter((user) => user.id !== socket.id);
    }
  });
});