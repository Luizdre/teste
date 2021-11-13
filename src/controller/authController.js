const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const axios = require('axios');
var userList = [];

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400, //um dia
    }); //gerando token, requer um campo único e um hash para gerar um token diferente
}

router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {

        if(await User.findOne({email}))
            return res.status(400).send({error: 'Usuário já existe'})

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({user, token: generateToken({id: user.id})});

    } catch(err){
        return res.status(400).send({error: 'Falha no registro ' + err})
    }
});

const watchUser = User.watch(options = {fullDocument: "updateLookup"});

watchUser.on('change', change => {
    User.find({}, (res, users) => {
        userList = users;
        socketIo.emit('usuario registrado', userList)})
})

router.get('/users', async (req, res) =>{
    User.find({}, (res, users) => {
        userList = users;
        socketIo.emit('list users', userList)})
    return res.send(userList);
    
});

router.post('/authenticate', async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user)
        return res.status(400).send({error: 'Usuário não encontrado'});
    
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Senha inválida'});

        user.password = undefined;

    res.send({user, token: generateToken({id: user.id})});
});

router.patch('/alter', async(req, res) =>{
    const {id, isMarked} = req.body;

    const user = await User.findById(id);

    user.isMarked = isMarked;

    await  user.update({isMarked: isMarked}).then((value) => { res.send(value)});

})

router.delete('/deleteUser', async(req, res) => {
    const {email} = req.body;

    await User.deleteOne({email}).then((value) => res.send(value));
})


//Usando Axios pra consumir API externa
router.get('/geolocation', async(req, res) =>{
    const instance = axios.create({
        headers: {"Authorization": "Token token=54877944cd5e4da524f8cc0e2abafd27"}
    })
    instance.get('https://www.cepaberto.com/api/v3/cep?cep=13476900').then(function(response){
        res.send(response.data.latitude)
    })
})

module.exports = app => app.use('/auth', router);