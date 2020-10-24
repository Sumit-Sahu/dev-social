const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router(); 

// @route   POST api/users
// @desc    Register User
// @access  Public

router.post('/', [
    body('name', 'Name is required')
    .not()
    .isEmpty(),
    body('email','please include a valid email').isEmail(),
    body('password','password should atleast 6 char').isLength({ min:6 })
],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    res.send("user route");
});

module.exports = router;