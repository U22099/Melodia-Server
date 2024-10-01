const User = require('../model/User');
const logOut = async (req, res) => {
    const _id =
    req.headers.Authorization?.split(" ")[1].split("/")[1] || req.headers.authorization?.split(" ")[1].split("/")[1];
    if(!_id){
        console.log("No id provided: ", _id);
        return res.sendStatus(401);
    }
    const user = await User.findOne({ _id });

    if(user){
        user.refreshToken = "";
        user.accessToken = "";
        await user.save();
    }
    //res.cookie('refreshToken', '', {
        //expires: new Date('1970-01-01'),
        //httpOnly: true, sameSite: 'None', secure: true
    //});
    //res.cookie('accessToken', '', {
        //expires: new Date('1970-01-01'),
        //httpOnly: true, sameSite: 'None', secure: true
    //});

    res.sendStatus(200);
}

module.exports = { logOut };
