const Music = require('../../model/Music');
const User = require('../../model/User');



const getMusic = async (req, res) => {
    const music = await Music.find({}, 'artist title image genre uploader');

    			const x = music.filter(x => (x.artist === "Eminem") || (x.title === "Payphone"));
			if(x){
				console.log(x)
				Promise.all(x.forEach(async (y) => {
				const image = (await User.findOne({username: "James"})).image;
				y.image = image;
				await y.save();
				}));
			}
    res.json({ "music": music });
}

const addMusic = async (req, res) => {
    const data = req.body;

    if (data.length != 0) {
        data.forEach(async (x) => {
            if(!(await Music.findOne({title: x.title}))){
                await Music.create({
                    "artist": x.artist,
                    "title": x.title,
                    "image": x.image,
                    "genre": x.genre,
                    "data": x.data,
                    "uploader": x.uploader
                });
                res.json({ "message": `Uploaded successfully by ${data[0].uploader}` });
            } else {
                res.json({ "message": `Duplicate found! }` });
            }
        });

        
    } else {
        res.json({"message": "No Data Received"})
    }
}
const getMusicById = async (req, res) => {
    const _id = req.body._id;
    const music = await Music.findOne({_id: _id}, 'data');

    res.json({ "music": music });
}


module.exports = {getMusic, addMusic, getMusicById}
