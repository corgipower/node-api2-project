const express = require('express');
const db = require('./data/db');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.json({message: 'Hello, World'})
})

server.get('/api/posts', (req, res) => {
    const posts = db.find()
        .then(posts => {
            if(posts) {
                res.json(posts);
            }else{
                return res.status(500).json({
                    errorMessage: 'no posts here'
                })
            }
        })
        .catch(err => console.log(err));
})

server.get('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const post = db.findById(id)
        .then(post => {
            if(post) {
                res.json(post);
            }else if(!post){
                res.status(404).json({
                    message: 'no post with that id',
                })
            }else{
                res.status(500).json({
                    errorMessage: 'we cannot get that post'
                })
            }
        })
        .catch(err => console.log(err));
})

server.get('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id;
    const post = db.findPostComments(id)
        .then(post => {
            if(post) {
                res.json(post);
            }else if(!post){
                res.status(404).json({
                    message: 'no post with that id',
                })
            }else{
                res.status(500).json({
                    errorMessage: 'we cannot get that post'
                })
            }
        })
        .catch(err => console.log(err));
})

server.post('/api/posts', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: 'We need a title and content',
        })
    }

    const post = db.insert({
        title: req.body.title,
        contents: req.body.contents,
    })
        .then(post => {
            if(post) {
                res.status(201).json(post);
            }
        })
        .catch(() => 
            res.status(500).json({
                error: 'oops, we didn\'t quite get that',
            }))


})

server.post('/api/posts/:id/comments', (req, res) => {
    if(!req.body.text) {
        return res.status(400).json({
            errorMessage: 'We need text',
        })
    }

    const id = req.params.id;

    db.insertComment(
        {
        text: req.body.text,
        post_id: id,
    }, id)
        .then(comment => {
            if(comment) {
                res.status(201).json(comment);
            } else {
                res.status(404).json({
                    message: 'oops, we don\'t have a post with that id ',
                })
            }
        })
        .catch(() => {
            res.status(500).json({
                error: 'we had server issues',
            })
        })
    })

server.put('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const post = db.findById(id);

    if(!post) {
        res.status(404).json({
            errorMessage: 'no post with this id',
        }) 
    }

    db.update(id, {
            title: req.body.title || post.title,
            contents: req.body.contents || post.contents,
        })
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                errorMessage: 'server oopsed',
            })
        })
})

server.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const post = db.findById(id);

    db.remove(id)
        .then(post => {
            if(!post) {
                res.status(404).json({
                    message: 'we never had that id',
                })
            } else {
                res.json({
                    message: 'post is gone now',
                })
            }
        })
        .catch(() => {
            res.status(500).json({
                error: 'server is unhappy',
            })
        })
})

server.listen(5000, () => {
    console.log('YAYZ! Server works!!');
})