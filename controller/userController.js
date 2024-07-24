const User = require('../model/User');
const Music = require('../model/Music');

const getData = async (req, res) => {
    const accessToken = req.headers.Authorization?.split(' ')[1] || req.headers.authorization?.split(' ')[1];
    if (!accessToken) return res.sendStatus(401);
    const user = await User.findOne({ accessToken: accessToken });

    if (user && (user.username === "Daniel" || user.username === "Swag")) {
        res.json({
            "username": user.username,
            "email": user.email,
            "image": user.image,
            "otherData": {
                "users": await User.find(),
                "music_count": (await Music.find()).length
            }
        });
    } else if(user){
        res.json({
            "username": user.username,
            "email": user.email,
            "image": user.image
        });
    } else {
        res.sendStatus(403);
    }
}

const updateData = async (req, res) => {
    const accessToken = req.headers.Authorization?.split(' ')[1] || req.headers.authorization?.split(' ')[1];
    if (!accessToken) return res.sendStatus(401);
    const user = await User.findOne({ accessToken: accessToken })
    const newUsername = req.body.username;
    const newEmail = req.body.email;
    const newImage = req.body.image;

    const userConflict = await User.findOne({$or: [{username: newUsername}, {email: newEmail}]});
    if(userConflict&&(userConflict.username != user.username)) return res.status(409).json({"message": 'Username or Email already exists'})
    if (user&&newUsername&&newEmail&&newImage) {
        
        user.username = newUsername;
        user.email = newEmail;
        user.image = newImage;

        user.save();
        res.json({ "message": "successful" });
    } else {
        res.json({ "message": "Empty Inputs Or Unauthorised User" });
    }
}
const deleteUser = async (req, res) => {
    const refreshToken = req.headers.Authorization?.split(' ')[2] || req.headers.authorization?.split(' ')[2];
    if (!refreshToken) return res.sendStatus(401);
    await User.findOneAndRemove({ refreshToken: refreshToken }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ "message": "Failed to delete user" });
        } else {
            return res.redirect('/');
        }
    });
}


module.exports = {getData, updateData, deleteUser}
