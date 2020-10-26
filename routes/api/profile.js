const express = require('express');
const router = express.Router(); 
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');

// @route   GET api/proile/me
// @desc    Get current user profile
// @access  private

router.get('/me',auth ,async (req, res) => {
    try{
        const profile = await Profile.findOne({ user : req.user.id}).populate('user', ['name' , 'avatar']);
        if(!profile) return res.status(400).json({ msg: 'There is no profile for user'});

        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error'});
    }

    
});

module.exports = router;