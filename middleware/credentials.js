const whitelist = [
    "https://u22099.github.io", 
    "http://localhost:5173",
    "https://qrdw9g-5173.csb.app",
    "https://codesandbox.io"];

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(whitelist.includes(origin)||!origin){
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials
