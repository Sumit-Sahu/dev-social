const express = require('express');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route   POST api/posts
// @desc    Create 
// @access  Private

router.post('/',
[
    auth,
    [
        body('text', 'Text is require')
        .not()
        .isEmpty()
    ]
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array()});
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = new Post({
            user:user.id,
            text:req.body.text,
            name:user.name,
            avatar: user.avatar
        });
        await post.save();
        res.json(post);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
    

});

// @route   GET api/posts
// @desc    Get all posts 
// @access  Private

router.get('/', auth, async (req, res) => {
    try {
        const post = await Post.find().sort({ date: -1});
        res.send(post);
    } catch (error) {
        console.error(errors.message);
        res.status(500).send('server error');
    }
});

// @route   GET api/posts/:id
// @desc    Get post by id 
// @access  Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ msg: 'Post not found'});
        res.send(post);
    } catch (error) {
        console.error(errors.message);
        if(error.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not found'});

        res.status(500).send('server error');
    }
});

// @route   DELETE api/posts/:id
// @desc    delete a post 
// @access  Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ msg: 'Post not found'});


        //check on user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }
        await post.remove();
        res.json({msg: 'Post Removed'});
    } catch (error) {
        console.error(errors.message);
        if(error.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not found'});
        res.status(500).send('server error');
    }
});

module.exports = router;