const User = require('../model/User');
const logOut = async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if(!accessToken) return res.sendStatus(401);
    const user = await User.findOne({ accessToken: accessToken });

    user.refreshToken = "";
    user.accessToken = "";
    await user.save();
    res.cookie('refreshToken', '', {
        expires: new Date('1970-01-01'),
        httpOnly: true
    });
    res.cookie('accessToken', '', {
        expires: new Date('1970-01-01'),
        httpOnly: true
    });

    res.sendStatus(200);
}

module.exports = { logOut };