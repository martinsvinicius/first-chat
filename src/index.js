const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//pasta 'public'
const public = path.join(__dirname, 'public');

//Entrega os arquivos da pasta 'public' para o express
app.use(express.static(public));

//Define as views como HTML
app.set('views', path.join(public));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Rota principal
app.use('/', (req, res) => {
  res.render('index.html');
});

let messages = [];

io.on('connection', (socket) => {
  console.log('a user has been connected');

  socket.emit('previousMessage', messages);

  socket.on('sendMessage', (data) => {
    messages.push(data);
    io.emit('receivedMessage', data);
  });
});


//Porta do servidor
server.listen(3000, () => {
  console.log('listen on *:3000');
});
