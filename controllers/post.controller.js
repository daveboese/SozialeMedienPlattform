//const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const fse = require("fs-extra");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

//Ruft alle Beiträge ab und sortiert sie nach Erstellungsdatum.
module.exports.readPost = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.send(posts);
  } catch (err) {
    console.log("Error fetching posts: " + err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Erstellt einen neuen Beitrag. Unterstützt Bilder und Videos.
module.exports.createPost = async (req, res) => {
  const fileName = req.body.posterId + Date.now() + ".jpg";
  if (req.file !== undefined) {
    try {
      console.log("lala");

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

    const fileStream = fs.createReadStream(req.file.path);

    await pipeline(
      fileStream,
      fs.createWriteStream(
        `${__dirname}/../client/public/uploads/posts/${fileName}`
      )
    );
  }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file ? "./uploads/posts/" + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    console.log("maman");
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.log("Error creating post: " + err);
    const errors = uploadErrors(err);
    res.status(400).json({ errors });
  } finally {
    // Vider le dossier temporaire
    try {
      await fse.emptyDir(`${__dirname}/../client/public/uploads/temp/`);
      // console.log("Dossier temporaire vidé.");
    } catch (err) {
      console.error("Error while emptying the temporary folder:", err);
    }
  }
};
//Aktualisiert den Inhalt eines Beitrags anhand seiner ID
// Update a post by its ID
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown: " + req.params.id);
  }

  const updatedRecord = {
    message: req.body.message,
  };

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Update error: " + err);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Löscht einen Beitrag anhand seiner ID
module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown: " + req.params.id);
  }

  try {
    const deletedPost = await PostModel.findByIdAndRemove(req.params.id);

    if (!deletedPost) {
      return res.status(404).send("Post not found");
    }

    res.status(200).json(deletedPost);
  } catch (err) {
    console.error("Delete error: " + err);
    res.status(500).send({ message: "Internal server error" });
  }
};

//Fügt einen Benutzer zur Liste der Beitrag-Liker hinzu
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }

    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Like error: " + err);
    res.status(500).send({ message: "Internal server error" });
  }
};

//Entfernt einen Benutzer aus der Liste der Beitrag-Liker
// Unlike a post by removing user's ID from likers array
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown: " + req.params.id);
  }

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }

    // Also remove the post's ID from user's likes array
    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Unlike error: " + err);
    res.status(500).send({ message: "Internal server error" });
  }
};

//Fügt einen Kommentar zu einem Beitrag hinzu
module.exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(400).send(err);
  }
};

// Bearbeitet den Text eines Kommentars
module.exports.editCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown: " + req.params.id);
  }

  try {
    const updatedPost = await PostModel.findById(req.params.id);

    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }

    const theComment = updatedPost.comments.find((comment) =>
      comment._id.equals(req.body.commentId)
    );

    if (!theComment) {
      return res.status(404).send("Comment not found");
    }

    theComment.text = req.body.text;

    await updatedPost.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Edit comment error: " + err);
    res.status(500).send({ message: "Internal server error" });
  }
};

//Löscht einen Kommentar aus einem Beitrag
module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true }
    )
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(400).send(err);
  }
};
