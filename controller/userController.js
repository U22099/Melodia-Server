const User = require("../model/User");
const Music = require("../model/Music");

const getData = async (req, res) => {
  const jData = await User.findOne({ username: "James" });
  await User.updateMany({ isAdmin: false }, { $set: { role: "user" } });
  await User.updateMany(
    { username: "Daniel" },
    { $set: { role: "developer" } }
  );
  await User.updateMany({ username: "Swag" }, { $set: { role: "designer" } });
  await User.updateMany({ image: "" }, { $set: { image: jData.image } });
  await Music.updateMany({}, { $set: { clicks: 1 } });
  await Music.updateMany(
    { title: "Middle Of The Night || CeeNaija.com" },
    { $set: { clicks: 10 } }
  );
  await Music.updateMany({ title: "Alec Benjamin - Devil Doesn't Bargain [Official]" }, { $set: { clicks: 9} });
  await Music.updateMany({ title: "Gnat" }, { $set: { clicks: 8 } });
  await Music.updateMany(
    { title: "Spinnin || VistaNaija.Com" },
    { $set: { clicks: 6 } }
  );
  await Music.updateMany(
    { title: "Alan Walker - Alone" },
    { $set: { clicks: 4 } }
  );
  await Music.updateMany(
    { title: "Unity | Nairaflaver.Com" },
    { $set: { clicks: 2 } }
  );

  const accessToken =
    req.headers.Authorization?.split(" ")[1] ||
    req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  if (user) {
    res.json({
      username: user.username,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
    });
  } else {
    res.sendStatus(403);
  }
};

const updateData = async (req, res) => {
  const accessToken =
    req.headers.Authorization?.split(" ")[1] ||
    req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });
  const newUsername = req.body.username;
  const newEmail = req.body.email;
  const newImage = req.body.image;

  const userConflict = await User.findOne({
    $or: [{ username: newUsername }, { email: newEmail }],
  });
  if (userConflict && userConflict.username != user.username)
    return res
      .status(409)
      .json({ message: "Username or Email already exists" });
  if (user && newUsername && newEmail && newImage) {
    user.username = newUsername;
    user.email = newEmail;
    user.image = newImage;

    user.save();
    res.json({ message: "successful" });
  } else {
    res.json({ message: "Empty Inputs Or Unauthorised User" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const accessToken =
      req.headers.Authorization?.split(" ")[1] ||
      req.headers.authorization?.split(" ")[1];
    if (!accessToken) return res.sendStatus(401);
    await User.findOneAndDelete({ accessToken: accessToken });
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

const getAdminData = async (req, res) => {
  const accessToken =
    req.headers.Authorization?.split(" ")[1] ||
    req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.sendStatus(401);
  const user = await User.findOne({ accessToken: accessToken });

  if (user && user.isAdmin) {
    const data = (await User.find({}, "image username email")).sort((a, b) =>
      a.username.localeCompare(b.username)
    );
    let chunkNo = req.query.chunkNo;
    let chunkAmount = 0;
    if (data.length % 10 === 0) {
      chunkAmount = data.length / 10;
    } else {
      chunkAmount = Math.floor(data.length / 10) + 1;
    }
    const x = (chunkNo > 1 ? 1 : 0) + (chunkNo - 1) * 10;
    const chunk = data.slice(x, x + 10);
    const no = await Music.countDocuments();
    res.json({
      users: { chunk: chunk, chunkAmount: chunkAmount },
      musicCount: no,
    });
  } else {
    res.sendStatus(403);
  }
};

const getAdmins = async (req, res) => {
  const admin = User.find({ isAdmin: true }, "username image role");

  res.json({ admin: admin });
};
module.exports = { getData, updateData, deleteUser, getAdminData, getAdmins };
