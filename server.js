const express = require('express');
const db = require('./database');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.json({message: 'Hello, World'})
})

server.get('/users', (req, res) => {
    const users = db.getUsers();
    if(users) {
        res.json(users);
    }else{
        return res.status(500).json({
            errorMessage: "The users information could not be retrieved."
        })
    }
})

server.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);

    if(user) {
        res.json(user);
    }else if(!user){
        res.status(404).json({
            message: "The user with the specified ID does not exist.",
        })
    }else{
        res.status(500).json({
            errorMessage: "The user information could not be retrieved."
        })
    }
})

server.post('/users', (req, res) => {
    if(!req.body.name || !req.body.bio) {
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user.",
        })
    }

    try{
        const newUser = db.createUser({
            name: req.body.name,
            bio: req.body.bio,
        })

        res.status(201).json(newUser);
    }
    catch{
        res.status(500).json({
            errorMessage: "There was an error while saving the user to the database",
        })
    }
})

server.put('/users/:id', (req, res) => {
    const user = db.getUserById(req.params.id);

    if(user) {
        const updatedUser = db.updateUser(user.id, {
            name: req.body.name || user.name,
            bio: req.body.bio || user.bio,
        })

        res.status(200).json(updatedUser);
    }else if(!user){
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    }else{
        res.status(500).json({
            errorMessage: "The user information could not be modified."
        })
    }
})

server.delete('/users/:id', (req, res) => {
    const user = db.getUserById(req.params.id);

    if(user) {
        db.deleteUser(user.id);

        // res.status(204).end(); // send back empty success response
        //or send success message
        res.json({
            message: 'User is gone now.',
        })
    }else if(!user){
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    }else {
        res.status(500).json({
            errorMessage: "The user could not be removed"
        })
    }

})

server.listen(5000, () => {
    console.log('YAYZ! Server works!!');
})