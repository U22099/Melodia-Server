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
            "isAdmin": true
        });
    } else if(user){
        res.json({
            "username": user.username,
            "email": user.email,
            "image": user.image,
            "isAdmin": false
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
    try{
        const accessToken = req.headers.Authorization?.split(' ')[1] || req.headers.authorization?.split(' ')[1];
        if (!accessToken) return res.sendStatus(401);
        await User.findOneAndDelete({ accessToken: accessToken });
        return res.sendStatus(200);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ "message": "Failed to delete user" });        
    }
}

        const getAdminData = async (req, res) => {
    const accessToken = req.headers.Authorization?.split(' ')[1] || req.headers.authorization?.split(' ')[1];
    if (!accessToken) return res.sendStatus(401);
    const user = await User.findOne({ accessToken: accessToken });

    if (user && (user.username === "Daniel" || user.username === "Swag")) {
        const data = await User.find({}, 'image username email');
        console.log("called");
        let chunkNo = req.query.chunkNo;
        let chunkAmount = 0;
        if(data.length % 10 === 0){
            chunkAmount = data.length/10;
        } else {
            chunkAmount = Math.floor(data.length/10) + 1;
        }
        const chunk = data.slice(((chunkNo > 1 ? 1 : 0) + ((chunkNo - 1) * 10)), (10 + ((chunkNo - 1) * 10)));
        console.log("called");
		  console.log(await Music.countDocuments())
        const y = 23
        const data = {
            "users": chunk,
            "musicCount": y
        }
        console.log(data)
        res.json({
            "users": chunk,
            "musicCount": y
        });
    } else {
        res.sendStatus(403);
    }
}

module.exports = {getData, updateData, deleteUser, getAdminData}
