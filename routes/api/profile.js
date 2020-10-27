const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router(); 
const request = require('request');
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

// @route   POST api/proile
// @desc    create or update profile
// @access  private

router.post('/',[auth, [
    body('status','Status is Required')
    .not()
    .isEmpty(),
    body('skills','Skills is Required')
    .not()
    .isEmpty()
] ] ,
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

     // Get fields
     const profileFields = {};
     profileFields.user = req.user.id;
     if (req.body.handle) profileFields.handle = req.body.handle;
     if (req.body.company) profileFields.company = req.body.company;
     if (req.body.website) profileFields.website = req.body.website;
     if (req.body.location) profileFields.location = req.body.location;
     if (req.body.bio) profileFields.bio = req.body.bio;
     if (req.body.status) profileFields.status = req.body.status;
     if (req.body.githubusername)
       profileFields.githubusername = req.body.githubusername;
    if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',').map(skill => skill.trim());
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    try{
        let profile = await Profile.findOne({ user: req.user.id});
        if(profile){
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

    // create 
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/proile/me
// @desc    Get current user profile
// @access  private

router.get('/', async (req, res) => {
    try{
        const profiles = await Profile.find().populate('user', ['name' , 'avatar']);
        if(!profiles) return res.status(400).json({ msg: 'There sre no profiles'});

        res.json(profiles);
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error'});
    }

    
});


// @route   GET api/proile/user/:user_id
// @desc    Get profile by user id
// @access  private

router.get('/user/:user_id', async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name' , 'avatar']);
        if(!profile) return res.status(400).json({ msg: 'Profile Not Found'});

        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId')
            return res.status(400).json({ msg: 'Profile Not Found'});
        res.status(500).json({ msg: 'Server Error'});
    }

    
});

// @route   DELETE api/proile
// @desc    Delete profile, user, and posts
// @access  private

router.delete('/', auth, async (req, res) => {
    try{
        // @to-do Remove User Posts

        // Remove profile
        await Profile.findOneAndDelete({ user: req.user.id } );

        // Remove user
        await User.findOneAndDelete({ _id: req.user.id } );

        res.json({ msg:'User Deleted'});
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error'});
    }

    
});

// @route   PUT api/proile/experience
// @desc    Add profile experience
// @access  private

router.put('/experience',
[
    auth, 
    [
        body('title','title is requered')
        .not()
        .isEmpty(),
        body('company','company is requered')
        .not()
        .isEmpty(),
        body('from','from date is requered')
        .not()
        .isEmpty(),
    ]

], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description       
    } = req.body
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description       
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id});
        // console.log(profile);

        profile.experience.unshift(newExp);
        await profile.save();

        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error'});
    }
});

// @route   DELETE api/proile/experience/:exp_id
// @desc    Delete experience from profile
// @access  private

router.delete('/experience/:exp_id', auth, async ( req, res ) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id});
        const index = profile.experience.map( exp => exp.id).indexOf(req.params.exp_id);
        if ( index >=0)
            profile.experience.splice(index,1);
        
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error'});
    }

});

// @route   PUT api/proile/education
// @desc    Add profile education
// @access  private

router.put('/education',
[
    auth, 
    [
        body('school','school is requered')
        .not()
        .isEmpty(),
        body('degree','degree is requered')
        .not()
        .isEmpty(),
        body('fieldofstudy','fieldofstudy is requered')
        .not()
        .isEmpty(),
        body('from','from date is requered')
        .not()
        .isEmpty(),
    ]

], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description       
    } = req.body
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description       
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id});
        // console.log(profile);

        profile.education.unshift(newEdu);
        await profile.save();

        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error'});
    }
});

// @route   DELETE api/proile/education/:edu_id
// @desc    Delete education from profile
// @access  private

router.delete('/education/:edu_id', auth, async ( req, res ) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id});
        const index = profile.education.map( exp => exp.id).indexOf(req.params.edu_id);
        if ( index >=0)
            profile.education.splice(index,1);
        
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error'});
    }

});



module.exports = router;