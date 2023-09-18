const fs = require("fs");
const fse = require("fs-extra");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");
const UserModel = require("../models/user.model");

module.exports.uploadProfil = async (req, res) => {
  try {
    if (
      req.file.mimetype != "image/jpg" &&
      req.file.mimetype != "image/png" &&
      req.file.mimetype != "image/jpeg"
    )
      throw Error("Invalid file format");

    if (req.file.size > 5000000000000000)
      throw Error("File size exceeds 500 KB");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  const fileName = req.body.name + ".jpg";
  const fileStream = fs.createReadStream(req.file.path);

  await pipeline(
    fileStream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  );

  try {
    console.log(req.body.userId);
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: "./uploads/profil/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).send({ message: err });
  } finally {
    // Vider le dossier temporaire
    try {
      await fse.emptyDir(`${__dirname}/../client/public/uploads/temp/`);
      console.log("Dossier temporaire vidé.");
    } catch (err) {
      console.error("Erreur lors de la vidange du dossier temporaire:", err);
    }
  }
};
