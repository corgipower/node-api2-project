const express = require('express');
const userPosts = require('../data/db');

const router = express.Router()

router.get('/', (req, res) => {
    res.json({message: 'Hello, World'})
})

router.get('/api/posts', (req, res) => {
    const posts = userPosts.find()
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

router.get('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const post = userPosts.findById(id)
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

router.get('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id;
    const post = userPosts.findPostComments(id)
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

router.post('/api/posts', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: 'We need a title and content',
        })
    }

    const post = userPosts.insert({
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

router.post('/api/posts/:id/comments', (req, res) => {
    if(!req.body.text) {
        return res.status(400).json({
            errorMessage: 'We need text',
        })
    }

    const id = req.params.id;

    userPosts.insertComment(
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
                error: 'we had router issues',
            })
        })
    })

router.put('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const post = userPosts.findById(id);

    if(!post) {
        res.status(404).json({
            errorMessage: 'no post with this id',
        }) 
    }

    userPosts.update(id, {
            title: req.body.title || post.title,
            contents: req.body.contents || post.contents,
        })
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                errorMessage: 'router oopsed',
            })
        })
})

router.delete('/api/posts/:id', (req, res) => {
    const id = req.params.id;
    const post = userPosts.findById(id);

    userPosts.remove(id)
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
                error: 'router is unhappy',
            })
        })
})

module.exports = router