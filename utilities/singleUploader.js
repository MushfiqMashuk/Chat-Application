const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

function uploader(folder, allowed_file_types, file_size, error_msg) {
  // defining uploads folder
  const uploads_folder = `${__dirname}/../public/uploads/${folder}/`;
  // defining storage

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploads_folder);
    },

    filename: (req, file, cb) => {
      // hjh djhfj.jpg -> jhh-jhkj7687678.jpg
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  // prepare the final multer object

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });

  return upload;
}

// export
module.exports = uploader;
