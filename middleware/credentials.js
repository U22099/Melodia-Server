const whitelist = ["https://website.com", "http://localhost:5173"];

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(whitelist.includes(origin)||!origin){
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials