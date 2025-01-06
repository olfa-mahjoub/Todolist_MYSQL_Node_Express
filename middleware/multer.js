const multer = require("multer");
/* Creating a storage object that will be used by multer to store the image. */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const now = new Date().toISOString();
    const date = now.replace(/:/g, "-");
    cb(null, date + file.originalname);
  },
});
const uploadImg = multer({ storage: storage });
exports.uploadImg = uploadImg;
