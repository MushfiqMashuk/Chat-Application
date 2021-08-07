const uploader = require("../../utilities/multipleUploader");

function attachmentUpload(req, res, next) {
  const upload = uploader(
    "attachments",
    ["image/jpeg", "image/jpg", "image/png"],
    2000000,
    "Only Allowed JPEG, JPG and PNG image types"
  );

  // call the middleware here
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

// export
module.exports = attachmentUpload;
