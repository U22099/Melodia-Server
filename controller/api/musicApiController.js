const Music = require('../../model/Music');

const getMusic = async (req, res) => {
    const music = await Music.find();

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
            }
        });

        res.json({ "message": `Uploaded successfully by ${data[0].uploader}` });
    } else {
        res.json({"message": "No Data Received"})
    }
}


module.exports = {getMusic, addMusic}