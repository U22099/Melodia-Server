const allowedOrigin = [
    'http://localhost:5173',
    'http://localhost:7700'];

const corsOption = {
    origin: (origin, callback) => {
        if(allowedOrigin.includes(origin) || !origin){
            callback(null, true);
        }else{
            callback(new Error('Not Allowed By CORS'));
        }
    },
    optionsSuccessfulStatus: 200
}

module.exports = corsOption