const app = require('express')();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').Server(app);
global.socketIo = require('socket.io')(http,  {
    upgradeTimeout: 30000
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


require('./controller/authController')(app);
require('./controller/projectController')(app);


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

socketIo.on('connection', (socket) =>{
    console.log(socket.id)
    socket.on('create user', (data)=>{
        console.log(data)
    })
})

http.listen(3000, () =>{});