const User = require('../model/User');
const Music = require('../model/Music');

const getData = async (req, res) => {
    const accessToken = req.headers.Authorization?.split(' ')[1] || req.headers.authorization?.split(' ')[1];
    if (!accessToken) return res.sendStatus(401);
    const user = await User.findOne({ accessToken: accessToken });

    const noProfileUser = await User.find({image: ""});
	if(noProfileUser){
		await Promise.all(noProfileUser.forEach(async (user) => {
			console.log("CAlled");
			const image = (await User.findOne({username: "James"})).image;
			user.image = image;
			await user.save();
		}));
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


module.exports = {getData, updateData, deleteUser}
