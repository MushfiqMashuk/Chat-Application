const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const { diskStorage } = require("multer");

function uploader(
  folder,
  allowed_file_types,
  file_size,
  max_number_of_files,
  error_msg
) {
  const UPLOADS_FOLDER = `${__dirname}/../public/uploads/${folder}/`;

  // define the storage

  const storage = diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER);
    },

    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .replaceAll(" ", "-") +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  // preparing the final multer object

  const upload = multer({
    storage: storage,
    limits: file_size,

    fileFilter: (req, file, cb) => {
      if (req.files.length > max_number_of_files) {
        cb(createError(`Maximum ${max_number_of_files} are allowed to upload`));
      } else {
        if (allowed_file_types.includes(file.mimetype)) {
          cb(null, true);
        } else {
          createError(error_msg);
        }
      }
    },
  });

  return upload;
}

// export
module.exports = uploader;
