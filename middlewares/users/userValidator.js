const { check, validationResult } = require("express-validator");
const User = require("../../models/People");
const createError = require("http-errors");
const { unlink } = require("fs");
const path = require("path");

const validateUsers = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required!")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than Alphabet")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid Email Address")
    .trim() // setting a custom validator to check the email is unique
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already in use!"); // I have to catch this error in the next middleware
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Must be a Bangladeshi number and contains +88")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile number already in use");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be 8 characters long & should contain atleast 1 lowercase 1 uppercase 1 symbol & 1 number"
    ),
];

const userValidatorHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  /*
  mapped() will give us a mapped error obj. mappedError:{
    name: {
      msg: 'Name is required'
    },
    email:{
      msg: 'Invalid Email'
    },
  }
  */

  if (Object.keys(mappedErrors).length === 0) {
    //error does not exists
    next();
  } else {
    // remove uploaded file (avatar)

    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    // response the client with the error

    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

// export the middleware array
module.exports = {
  validateUsers,
  userValidatorHandler,
};
