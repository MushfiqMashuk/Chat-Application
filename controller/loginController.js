// internal dependencies
const User = require("../models/People");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// get login details
function getLogin(req, res, next) {
  res.render("index");
}

async function login(req, res, next) {
  try {
    // finding the user with email/mobile
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });

    // if the username matches
    if (user && user._id) {
      // compare password
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      // if the password matches
      if (isValidPassword) {
        // generate user object for JWT
        const userObject = {
          userid: user._id,
          username: user.name,
          email: user.email,
          mobile: user.mobile,
          avatar: user.avatar || null,
          role: user.role || "user",
        };

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        // set the token as a cookie at the client end
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY, // 1 day
          httpOnly: true, // ensures- can not be manipulate from the front end
          signed: true,
        });

        // set logged in user info
        res.locals.loggedInUser = userObject;
        // finally render the inbox page for the user
        res.redirect("inbox");

      } else {
        throw createError("Login Failed! Please Try Again!");
      }
    } else {
      throw createError("Incorrect Username! Please Try Again!");
    }
  } catch (err) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);

  res.send("Logged Out");
}

// export
module.exports = {
  getLogin,
  login,
  logout,
};
