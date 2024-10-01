const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1].split("/")[0];
    if(!token){
        console.log("No token");
        return res.sendStatus(401)
    };
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) return res.status(403).json({'message': 'Wrong Token'});
            req.username = decoded.username;
            next()
        }
    );
}

module.exports = verifyJWT;
