const express = require('express');
const { body, validationResult } = require('express-validator');
const gravatar =require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router(); 

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public

router.post('/', [
    body('name', 'Name is required')
    .not()
    .isEmpty(),
    body('email','please include a valid email').isEmail(),
    body('password','password should atleast 6 char').isLength({ min:6 })
],async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {name ,email, password} = req.body;
    try{
        let user = await User.findOne({ email });
        if(user) return res.status(400).json({  errors :[{ msg: 'User already exists'}] });

        const avatar = gravatar.url( email, {
            s:'200',
            r:'pg',
            d:'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

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
        res.send(500).send('server error');
    }
   

});

module.exports = router;