module.exports = function(server) {

  const io = require('socket.io')(server);

  // Store objects in both directions for easier two way lookup
  let connectedUsers = io.connectedUsers = {};
  let connectedSockets = {};

  io.on('connection', (socket) => {
    console.log(`User with socket.id = ${socket.id} connected`);

    // Initialize and maintain whether connected
    socket.emit('usernameRequest', null);
    socket.on('usernameResponse', (username) => {
      // Add { user: array of sockets }
      if (connectedUsers.hasOwnProperty(username)) {
        connectedUsers[username].push(socket.id);
      } else {
        connectedUsers[username] = [ username ];
        // User connects broadcast
        // (only first time since multiple sockets for one user is allowed)
        socket.broadcast.emit('userConnect', username);
      }
      // Add { socket: user }
      connectedSockets[socket.id] = username;

      // Disconnecting socket and broadcasting if all sockets from user are gone
      socket.on('disconnect', () => {
        if (connectedUsers[username].length === 1) {
          delete connectedUsers[username];
          socket.broadcast.emit('userDisconnect', username);
        } else {
          let i = connectedUsers[username].indexOf(socket.id);
          connectedUsers[username].splice(i, 1);
        }
        delete connectedSockets[socket.id];
      });

      // Verify that connection is established and ready
      socket.emit('connectionEstablished', connectedUsers);
    });

    // Chat broadcast
    socket.on('msg', (data) => {
      socket.broadcast.emit('msgAll', data);
    });
  });

  return io;
};
