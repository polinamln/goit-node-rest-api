import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve("tmp"));
  },

  filename(req, file, cb) {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname);
    const id = crypto.randomUUID();

    cb(null, `${basename}-${id}${extname}`);
  },
});

export default multer({ storage });
