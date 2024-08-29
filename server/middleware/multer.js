import multer from "multer";
import path from "path";

export const multerUpload = multer({
  storage: multer.diskStorage({}), //temporary copy
  fileFilter: (req, file, cb) => {
    console.log("multer", file);
    let extension = path.extname(file.originalname).toLowerCase();
    console.log("multer", file.originalname);
    if (extension !== ".jpg" && extension !== ".jpeg" && extension !== ".png") {
      cb(new Error("File extension not supported"), false);
      return;
    }
    cb(null, true);
  },
});
