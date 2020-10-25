const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    // get token from header
    const token = req.header('x-auth-token');

    // check if not token
    if(!token)
        return res.status(401).json({ msg : 'No token, authorization denined'});

    // verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtToken'));
        req.user = decoded.user;
        next();
    }
    catch(err){
        console.log(err.message);
        return res.status(401).json({ msg : 'Not a valid token'});

    }

    
}