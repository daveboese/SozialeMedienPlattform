const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

//Ruft alle Benutzer ab (ohne Passwörter)
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

//Ruft die Informationen eines bestimmten Benutzers anhand seiner ID ab
module.exports.userInfo = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);

    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send(user);
  } catch (err) {
    console.log("Error fetching user info: " + err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Aktualisiert die Bio eines Benutzers anhand seiner ID
module.exports.updateUser = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.send(updatedUser);
  } catch (err) {
    console.log("Error updating user: " + err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Löscht einen Benutzer anhand seiner ID
module.exports.deleteUser = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);

    await UserModel.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Successfully deleted." });
  } catch (err) {
    console.log("Error deleting user: " + err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Fügt einen Benutzer zu den Followern hinzu
module.exports.follow = async (req, res) => {
  try {
    if (
      !ObjectID.isValid(req.params.id) ||
      !ObjectID.isValid(req.body.idToFollow)
    )
      return res.status(400).send("ID unknown : " + req.params.id);

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
    );

    const followedUser = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true }
    );

    res.send({ user, followedUser });
  } catch (err) {
    console.log("Error following user: " + err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Entfernt einen Benutzer von den Followern
module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await userModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true }
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err }))
    ),
      // Retirer de la liste des followers
      await userModel.findByIdAndUpdate(
        req.body.idToUnfollow,
        { $pull: { followers: req.params.id } },
        { new: true, upsert: true }
          .then((data) => res.send(data))
          .catch((err) => res.status(500).send({ message: err }))
      );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
