const router = require("express").Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./client/public/uploads/posts/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", postController.readPost); // Ruft alle Beiträge ab
router.post("/", upload.single("file"), postController.createPost); // Erstellt einen neuen Beitrag
router.put("/:id", postController.updatePost); //Aktualisiert den Inhalt eines Beitrags
router.delete("/:id", postController.deletePost); // Löscht einen Beitrag.
router.patch("/like-post/:id", postController.likePost); //Liked einen Beitrag
router.patch("/unlike-post/:id", postController.unlikePost); //Entliked einen Beitrag.

// comments
router.patch("/comment-post/:id", postController.commentPost); //Kommentiert einen Beitrag
router.patch("/edit-comment-post/:id", postController.editCommentPost); //Bearbeitet einen Kommentar;
router.patch("/delete-comment-post/:id", postController.deleteCommentPost); //Löscht einen Kommentar;

module.exports = router;
