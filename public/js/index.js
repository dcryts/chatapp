$(document).ready(function() {
  /*
  * Client side index javascript
  */

  let clientUsername;
  let connectedUsers = [];
  // Socket initial connection
  let socket = io();

  // Retrieve username
  socket.on('usernameRequest', () => {
    $.ajax({
      url: '/api/user_data',
      type: 'GET',
      success: (data, status) => {
        clientUsername = data.username;
        socket.emit('usernameResponse', clientUsername);
      }
    });
  });
  // Finalize connection on client side
  socket.on('connectionEstablished', (users) => {
    console.log(users);
    // Update users
    connectedUsers = connectedUsers.concat(Object.keys(users));
    console.log(connectedUsers);
    appendConnectedUsers(connectedUsers);
    // Notify via chat
    appendMessage('<li class="message"><span class="server-message">Connected to chat</span></li>');
    // Focus chat
    $('#chat-area').focus();
  });

  // Receive message
  socket.on('msgAll', (msgObj) => {
    appendMessage(formatHTMLMessage(msgObj));
  });
  // User connects
  socket.on('userConnect', (username) => {
    connectedUsers.push(username);
    appendConnectedUser(username);
    appendMessage(`<li class="message"><span class="server-message">${username} connected to chat</span></li>`);
  });
  // User disconnects
  socket.on('userDisconnect', (username) => {
    let i = connectedUsers.indexOf(username);
    connectedUsers.splice(i, 1);
    deleteConnectedUser(username);
    appendMessage(`<li class="message"><span class="server-message">${username} disconnected from chat</span></li>`);
  });

  // Send message controls
  $('#chat-send').click(sendMessage);
  $('#chat-area').keypress( (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  // Logout control
  $('#chat-logout').click( () => {
    $.ajax({
      url: '/login/logout',
      type: 'GET',
      success: (success, error) => {
        console.log('logout');
      },
    });
  });

  // Send logic
  function sendMessage() {
    // Build message object
    let msgObj = {};
    msgObj.username = clientUsername;
    msgObj.msg = $('#chat-area').val();
    msgObj.date = Date.now();
    msgObj.msg = msgObj.msg.replace(/^\s+|\s+$/gm,'');
    if (msgObj.msg !== null && msgObj.msg !== '') {
      // Actually send message
      socket.emit('msg', msgObj);
      // Display own message on cliet
      appendMessage(formatHTMLMessage(msgObj));

      // Post for logging chat to DB
      $.ajax({
        url: '/',
        type: 'POST',
        data: msgObj,
        success: (res, status, jqXHR) => {
          console.log(`Post Status: ${status}`);
        },
        error: (jqXHR, status, err) => {
          console.log(`Post Error: ${err}`);
        },
      });
    }

    // Clear textarea and focus
    $('#chat-area').val('').focus();
  }

  function formatHTMLMessage(msgObj) {
    let date = new Date(msgObj.date);
    let hours = ('0'+date.getHours()).slice(-2);
    let minutes = ('0'+date.getMinutes()).slice(-2);
    let seconds = ('0'+date.getSeconds()).slice(-2);
    let message = `<li class="message"><span class="msg-time">(${hours}:${minutes}:${seconds})</span><span class="msg-username">${msgObj.username}: </span><span class="msg-message">${msgObj.msg}</span></li>`;
    return message;
  }

  function appendMessage(html) {
    $('ul.chat-log').append(html);
    $('.chat-log-wrap').scrollTop($('.chat-log-wrap')[0].scrollHeight);
  }

  function appendConnectedUsers(users) {
    for (i in users) {
      if ($(`#${users[i]}`).length === 0) {
        appendConnectedUser(users[i]);
      }
    }
  }

  function appendConnectedUser(username) {
    $('ul.user-list').append(`<li id="${username}" class="user"><span class="msg-username">${username}</span></li>`);
  }

  function deleteConnectedUser(username) {
    if ($(`#${username}`).length !== 0) {
      $(`#${username}`).remove();
    }
  }

});
