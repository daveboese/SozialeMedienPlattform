const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./client/public/uploads/temp/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// auth
router.post("/register", authController.signUp); //Benutzerregistrierung
router.post("/login", authController.signIn); //Benutzeranmeldung
router.get("/logout", authController.logout); //Benutzerabmeldung

// user DB
router.get("/", userController.getAllUsers); //Ruft alle Benutzer ab
router.get("/:id", userController.userInfo); //Ruft die Informationen eines bestimmten Benutzers ab
router.put("/:id", userController.updateUser); // Aktualisiert die Bio eines Benutzers
router.delete("/:id", userController.deleteUser); //Löscht einen Benutzer
router.patch("/follow/:id", userController.follow); //Folgt einem Benutzer
router.patch("/unfollow/:id", userController.unfollow); //Entfolgt einem Benutzer

// upload
router.post("/upload", upload.single("file"), uploadController.uploadProfil);

module.exports = router;
