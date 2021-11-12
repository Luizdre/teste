const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
global.socketIo = require('socket.io')(http,  {
    upgradeTimeout: 30000
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


require('./src/controller/authController')(app);
require('./src/controller/projectController')(app);


app.get('/', (req,res) => {
    res.sendFile('C:/Users/Andre/Desktop/API/index.html')
})

socketIo.on('connection', (socket) =>{
    console.log(socket.id)
    socket.on('create user', (data)=>{
        console.log(data)
    })
})

http.listen(3000, () =>{});