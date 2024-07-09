const allowedOrigin = [
    'https://melodia-f4nd.onrender.com',
    'https://u22099.github.io/Melodia/'
];

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
