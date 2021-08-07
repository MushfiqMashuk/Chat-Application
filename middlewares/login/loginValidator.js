const { check, validationResult } = require("express-validator");

const validateLogin = [
  check("username")
    .isLength({
      min: 1,
    })
    .withMessage("Email or Mobile number is required!"),

  check("password")
    .isLength({
      min: 1,
    })
    .withMessage("Password required!"),
];

function validateLoginHandler(req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: mappedErrors,
    });
  }
}

// export
module.exports = {
  validateLogin,
  validateLoginHandler,
};
