const jwt = require('jsonwebtoken');
const User = require('../model/User');

const handleRefreshToken = async (req, res) => {
    const refreshToken = req.headers.authorization?.split(" ")[1].split("/")[0];
    const _id =
    req.headers.authorization?.split(" ")[1].split("/")[1];
    if(!refreshToken || !_id) return res.sendStatus(401);
    const user = await User.findOne({ _id });

    if(!user) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err || (user.username !== decoded.username)) return res.redirect('/');
            const accessToken = jwt.sign(
                {'username': user.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1h'}
            );
            user.accessToken = accessToken;
            await user.save();
            //res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 10 * 60 * 1000 });
            res.status(200).json({ accessToken});
        }
    )
}

module.exports = {handleRefreshToken};
