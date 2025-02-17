const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public

router.get('/', auth, async (req, res) => {

    try{
        const id = req.user.id;
        const user = await User.findById(id).select('-password');
        res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

    
});

// @route   POST api/auth
// @desc    Authenticate User
// @access  Public

router.post('/', [
    body('email','please include a valid email').isEmail(),
    body('password','password required').exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
    try{
        let user = await User.findOne({ email });
        if(!user) return res.status(400).json({  errors :[{ msg: 'Invalid Credentials'}] });

        const isMatch = await bcrypt.compare(password,user.password );
        if(!isMatch){
            return res.status(400).json({  errors :[{ msg: 'Invalid Credentials'}] });
        }

        const payload = {
            user:{
                id: user.id
            }
        };

        jwt.sign(
        payload,
        config.get('jwtToken'),
        {expiresIn: 36000},
        (err, token) => {
            if(err) throw err;
            res.json({ token });
        }
        );
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
   

});

module.exports = router;